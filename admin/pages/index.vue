<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Songs</h1>
        <p class="text-muted text-sm mt-1">{{ filtered.length }} of {{ songs.length }} songs</p>
      </div>
      <NuxtLink to="/songs/add" class="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
        + Add Song
      </NuxtLink>
    </div>

    <!-- Search + filter -->
    <div class="flex gap-3 mb-6">
      <input
        v-model="query"
        type="text"
        placeholder="Search title, artist, chord..."
        class="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
      />
      <select v-model="diffFilter" class="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent">
        <option value="">All difficulties</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-muted text-center py-20">Loading songs...</div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 text-sm">
      {{ error }}
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="text-center py-20">
      <p class="text-4xl mb-4">♪</p>
      <p class="text-muted">No songs yet. <NuxtLink to="/songs/add" class="text-accent underline">Add the first one.</NuxtLink></p>
    </div>

    <!-- Song grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="song in filtered"
        :key="song.id"
        class="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors"
      >
        <!-- Gradient bar -->
        <div class="h-2" :style="{ background: `linear-gradient(to right, ${song.gradient[0]}, ${song.gradient[1]})` }" />

        <div class="p-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h2 class="font-bold text-white truncate">{{ song.title }}</h2>
              <p class="text-muted text-sm truncate">{{ song.artist || 'Unknown artist' }}</p>
            </div>
            <span :class="diffColor(song.difficulty)" class="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap shrink-0">
              {{ song.difficulty }}
            </span>
          </div>

          <div class="flex flex-wrap gap-1.5 mt-3">
            <span class="text-xs bg-border text-accent px-2 py-0.5 rounded font-mono font-bold">{{ song.key }}</span>
            <span class="text-xs bg-border text-muted px-2 py-0.5 rounded">{{ song.category }}</span>
            <span class="text-xs text-muted">{{ song.lines.length }} lines</span>
          </div>

          <div v-if="song.chords.length" class="flex flex-wrap gap-1 mt-3">
            <span v-for="c in song.chords.slice(0, 6)" :key="c" class="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded font-mono">
              {{ c }}
            </span>
            <span v-if="song.chords.length > 6" class="text-xs text-muted">+{{ song.chords.length - 6 }}</span>
          </div>

          <div class="flex gap-2 mt-4">
            <NuxtLink :to="`/songs/${song.id}`" class="flex-1 text-center text-sm bg-border hover:bg-accent/20 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
              Edit
            </NuxtLink>
            <button @click="confirmDelete(song)" class="text-sm bg-red-900/30 hover:bg-red-800/50 text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <div v-if="deleting" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="bg-surface border border-border rounded-xl p-6 max-w-sm w-full">
        <h3 class="font-bold text-lg mb-2">Delete song?</h3>
        <p class="text-muted text-sm mb-6">"{{ deleting.title }}" will be permanently removed.</p>
        <div class="flex gap-3">
          <button @click="deleting = null" class="flex-1 bg-border hover:bg-border/70 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button @click="doDelete" :disabled="deleteLoading" class="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            {{ deleteLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '~/composables/useSongs'

const { songs, loading, error, fetchSongs, deleteSong } = useSongs()
const query = ref('')
const diffFilter = ref('')
const deleting = ref<Song | null>(null)
const deleteLoading = ref(false)

await fetchSongs()

const filtered = computed(() => {
  let result = songs.value
  if (diffFilter.value) result = result.filter((s) => s.difficulty === diffFilter.value)
  const q = query.value.toLowerCase().trim()
  if (q) result = result.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.chords.some((c) => c.toLowerCase().includes(q))
  )
  return result
})

function diffColor(d: string) {
  return {
    Beginner: 'bg-green-900/40 text-green-400',
    Intermediate: 'bg-orange-900/40 text-orange-400',
    Advanced: 'bg-red-900/40 text-red-400',
  }[d] ?? 'bg-border text-muted'
}

function confirmDelete(song: Song) { deleting.value = song }

async function doDelete() {
  if (!deleting.value) return
  deleteLoading.value = true
  await deleteSong(deleting.value.id)
  deleteLoading.value = false
  deleting.value = null
}
</script>
