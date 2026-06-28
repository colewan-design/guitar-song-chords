<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/" class="text-muted hover:text-white transition-colors text-sm">← Songs</NuxtLink>
      <span class="text-border">/</span>
      <h1 class="text-xl font-bold">Edit Song</h1>
    </div>

    <div v-if="loadingPage" class="text-muted text-center py-20">Loading...</div>
    <div v-else-if="!song" class="text-muted text-center py-20">Song not found.</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
          <h2 class="font-semibold text-sm text-muted uppercase tracking-wider">Chord Sheet</h2>
          <span class="text-xs text-muted">{{ parsedLines.length }} lines</span>
        </div>
        <textarea
          v-model="form.sheetText"
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
          <span class="text-xs text-muted">Chords:</span>
          <span v-for="c in detectedChords" :key="c" class="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded font-mono">{{ c }}</span>
        </div>
      </div>

      <div v-if="error" class="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 text-sm">{{ error }}</div>

      <div class="flex gap-3">
        <NuxtLink to="/" class="flex-1 text-center bg-border hover:bg-border/70 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="saving"
          class="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { parseSheet, extractChords } from '~/utils/parseSheet'
import type { Song } from '~/composables/useSongs'

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
const route = useRoute()
const router = useRouter()
const { getSong, updateSong, error } = useSongs()

const loadingPage = ref(true)
const saving = ref(false)
const song = ref<Song | null>(null)

const form = reactive({
  title: '',
  artist: '',
  key: '',
  difficulty: 'Beginner',
  category: '',
  sheetText: '',
})

function linesToText(lines: Song['lines']) {
  const parts: string[] = []
  for (const line of lines) {
    if (!line.chord && !line.lyric) { parts.push(''); continue }
    if (line.chord) parts.push(line.chord)
    if (line.lyric) parts.push(line.lyric)
  }
  return parts.join('\n')
}

onMounted(async () => {
  const data = await getSong(route.params.id as string)
  song.value = data
  if (data) {
    form.title = data.title
    form.artist = data.artist
    form.key = data.key
    form.difficulty = data.difficulty
    form.category = data.category
    form.sheetText = linesToText(data.lines)
  }
  loadingPage.value = false
})

const parsedLines = computed(() => parseSheet(form.sheetText))
const detectedChords = computed(() => extractChords(parsedLines.value))

async function handleSubmit() {
  saving.value = true
  const ok = await updateSong(route.params.id as string, { ...form })
  saving.value = false
  if (ok) router.push('/')
}
</script>
