<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-bold">All Songs</h1>
        <p class="text-muted text-sm mt-1">{{ filtered.length }} of {{ songs.length }} songs</p>
      </div>
      <NuxtLink to="/songs/add" class="bg-accent hover:bg-accent-dark text-black px-5 py-2 rounded-full font-semibold text-sm transition-colors">
        + Add Song
      </NuxtLink>
    </div>

    <!-- Search + filter -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="query"
          type="text"
          placeholder="Search title, artist, chord…"
          class="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>
      <div class="flex items-center gap-1 bg-surface border border-border rounded-xl px-1 py-1 overflow-x-auto">
        <button
          v-for="d in ['Beginner', 'Intermediate', 'Advanced']"
          :key="d"
          @click="diffFilter = d === diffFilter ? '' : d"
          :class="['shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors', diffFilter === d ? 'bg-accent text-black' : 'text-muted hover:text-white']"
        >
          {{ d }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-950/40 border border-red-800/50 text-red-400 rounded-2xl p-5 text-sm">{{ error }}</div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="text-center py-24">
      <div class="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span class="text-3xl">♪</span>
      </div>
      <p class="text-muted-light font-medium mb-1">No songs found</p>
      <NuxtLink to="/songs/add" class="text-accent text-sm hover:underline">Add the first one →</NuxtLink>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="song in filtered"
        :key="song.id"
        class="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all hover:bg-card"
      >
        <div
          class="h-28 relative flex items-center justify-center"
          :style="{ background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})` }"
        >
          <span class="text-4xl opacity-70">♪</span>
          <div class="absolute top-3 right-3">
            <span :class="diffBadge(song.difficulty)" class="text-xs font-bold px-2.5 py-1 rounded-full">{{ song.difficulty }}</span>
          </div>
        </div>
        <div class="p-4">
          <h2 class="font-bold text-white truncate text-sm">{{ song.title }}</h2>
          <p class="text-muted text-xs mt-0.5 truncate">{{ song.artist || 'Unknown artist' }}</p>
          <div class="flex flex-wrap gap-1.5 mt-3">
            <span class="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-md font-mono font-bold">{{ song.key }}</span>
            <span class="text-xs bg-border/60 text-muted-light px-2 py-0.5 rounded-md">{{ song.category }}</span>
          </div>
          <div v-if="song.chords.length" class="flex flex-wrap gap-1 mt-3">
            <span v-for="c in song.chords.slice(0, 5)" :key="c" class="text-xs bg-surface border border-border text-muted-light px-1.5 py-0.5 rounded font-mono">{{ c }}</span>
            <span v-if="song.chords.length > 5" class="text-xs text-muted">+{{ song.chords.length - 5 }}</span>
          </div>
          <div class="flex gap-2 mt-4">
            <NuxtLink :to="`/songs/${song.id}`" class="flex-1 text-center text-xs bg-border/60 hover:bg-accent/20 hover:text-accent text-muted-light px-3 py-2 rounded-xl transition-colors font-semibold">Edit</NuxtLink>
            <button @click="confirmDelete(song)" class="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 px-3 py-2 rounded-xl transition-colors font-semibold">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <Transition name="fade">
      <div v-if="deleting" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div class="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <div class="w-12 h-12 bg-red-950/50 border border-red-800/50 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-1">Delete song?</h3>
          <p class="text-muted text-sm mb-6">"{{ deleting.title }}" will be permanently removed.</p>
          <div class="flex gap-3">
            <button @click="deleting = null" class="flex-1 bg-border/60 hover:bg-border text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <button @click="doDelete" :disabled="deleteLoading" class="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              {{ deleteLoading ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

function diffBadge(d: string) {
  return {
    Beginner: 'bg-green-950/80 text-green-400 border border-green-800/50',
    Intermediate: 'bg-orange-950/80 text-orange-400 border border-orange-800/50',
    Advanced: 'bg-red-950/80 text-red-400 border border-red-800/50',
  }[d] ?? 'bg-black/50 text-muted border border-border'
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
