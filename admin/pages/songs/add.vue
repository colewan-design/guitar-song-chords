<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/" class="text-muted hover:text-white transition-colors text-sm">← Songs</NuxtLink>
      <span class="text-border">/</span>
      <h1 class="text-xl font-bold">Add Song</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Metadata -->
      <div class="bg-surface border border-border rounded-xl p-6 space-y-4">
        <h2 class="font-semibold text-sm text-muted uppercase tracking-wider">Song Details</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Title *</label>
            <input v-model="form.title" type="text" placeholder="Song title" required
              class="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Artist</label>
            <input v-model="form.artist" type="text" placeholder="Artist name"
              class="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Category</label>
            <input v-model="form.category" type="text" placeholder="Folk, Blues, Gospel..."
              class="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Key</label>
            <input v-model="form.key" type="text" placeholder="G, Am, D..." maxlength="3"
              class="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Difficulty</label>
            <div class="flex gap-2">
              <button v-for="d in DIFFICULTIES" :key="d" type="button"
                @click="form.difficulty = d"
                :class="form.difficulty === d ? 'bg-accent text-white border-accent' : 'bg-card text-muted border-border hover:border-accent/50'"
                class="flex-1 border rounded-lg py-2 text-sm font-semibold transition-colors">
                {{ d }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chord sheet -->
      <div class="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-sm text-muted uppercase tracking-wider">Chord Sheet *</h2>
          <span class="text-xs text-muted">{{ parsedLines.length }} lines parsed</span>
        </div>

        <div class="bg-card border border-border rounded-lg p-3 text-xs font-mono text-muted leading-relaxed">
          <p class="text-accent font-semibold mb-1">Format: chord names on a line above matching lyrics</p>
          <p>G           C        G</p>
          <p>First line of lyrics here</p>
          <p class="mt-1">             D</p>
          <p>Second line of lyrics</p>
        </div>

        <textarea
          v-model="form.sheetText"
          placeholder="Paste or type your chord sheet here..."
          rows="14"
          class="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-muted font-mono focus:outline-none focus:border-accent resize-y"
        />
      </div>

      <!-- Preview -->
      <div v-if="parsedLines.length > 0" class="bg-surface border border-border rounded-xl p-6">
        <h2 class="font-semibold text-sm text-muted uppercase tracking-wider mb-4">Preview</h2>
        <div class="space-y-0.5">
          <div v-for="(line, i) in parsedLines.slice(0, 20)" :key="i">
            <p v-if="!line.chord && !line.lyric" class="h-3" />
            <template v-else>
              <p v-if="line.chord" class="font-mono text-xs text-accent font-bold">{{ line.chord }}</p>
              <p v-if="line.lyric" class="font-mono text-sm text-white">{{ line.lyric }}</p>
            </template>
          </div>
          <p v-if="parsedLines.length > 20" class="text-muted text-xs mt-2">+ {{ parsedLines.length - 20 }} more lines</p>
        </div>
        <div v-if="detectedChords.length" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span class="text-xs text-muted">Detected chords:</span>
          <span v-for="c in detectedChords" :key="c" class="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded font-mono">{{ c }}</span>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 text-sm">{{ error }}</div>

      <!-- Actions -->
      <div class="flex gap-3">
        <NuxtLink to="/" class="flex-1 text-center bg-border hover:bg-border/70 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="saving"
          class="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
          {{ saving ? 'Saving...' : 'Save Song' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { parseSheet, extractChords } from '~/utils/parseSheet'

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
const router = useNavigator()
const { addSong, error } = useSongs()

const saving = ref(false)
const form = reactive({
  title: '',
  artist: '',
  key: '',
  difficulty: 'Beginner',
  category: '',
  sheetText: '',
})

const parsedLines = computed(() => parseSheet(form.sheetText))
const detectedChords = computed(() => extractChords(parsedLines.value))

async function handleSubmit() {
  saving.value = true
  const song = await addSong({ ...form })
  saving.value = false
  if (song) router.push('/')
}

function useNavigator() {
  return useRouter()
}
</script>
