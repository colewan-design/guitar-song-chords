<template>
  <div>
    <div class="flex gap-8">
      <!-- Left / main column -->
      <div class="flex-1 min-w-0">

        <!-- COLLECTIONS YOU'LL LOVE -->
        <section class="mb-10">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xs font-bold uppercase tracking-widest text-muted-light">Collections You'll Love</h2>
            <NuxtLink to="/songs" class="text-xs font-bold tracking-widest text-accent hover:text-accent-dark transition-colors">VIEW ALL</NuxtLink>
          </div>

          <div v-if="loading" class="grid grid-cols-2 gap-3">
            <div v-for="i in 6" :key="i" class="bg-surface border border-border rounded-2xl h-20 animate-pulse" />
          </div>

          <div v-else class="grid grid-cols-2 gap-3">
            <button
              v-for="col in collections"
              :key="col.label"
              @click="goToSongs(col.filter)"
              class="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-accent/40 hover:bg-card transition-all text-left group"
            >
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0', col.bg]">
                <component :is="col.icon" class="w-6 h-6 text-white" />
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-white text-sm truncate group-hover:text-accent transition-colors">{{ col.label }}</p>
                <p class="text-xs text-muted mt-0.5">{{ col.count }} songs</p>
              </div>
            </button>
          </div>
        </section>

        <!-- RECENTLY ADDED -->
        <section class="mb-10">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xs font-bold uppercase tracking-widest text-muted-light">Recently Added</h2>
            <NuxtLink to="/songs" class="text-xs font-bold tracking-widest text-accent hover:text-accent-dark transition-colors">VIEW ALL</NuxtLink>
          </div>

          <div v-if="loading" class="flex gap-4 overflow-hidden">
            <div v-for="i in 4" :key="i" class="w-40 shrink-0 bg-surface border border-border rounded-2xl h-52 animate-pulse" />
          </div>

          <div v-else-if="recent.length === 0" class="text-muted text-sm">No songs yet.</div>

          <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div
              v-for="song in recent"
              :key="song.id"
              class="w-40 shrink-0 group cursor-pointer"
              @click="navigateTo(`/songs/${song.id}`)"
            >
              <div
                class="w-40 h-40 rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden group-hover:opacity-80 transition-opacity"
                :style="{ background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})` }"
              >
                <!-- Music note icon -->
                <svg class="w-14 h-14 text-white opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/>
                </svg>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center ml-auto">
                    <svg class="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <p class="text-sm font-semibold text-white truncate">{{ song.title }}</p>
              <p class="text-xs text-muted mt-0.5 truncate">{{ song.artist || 'Unknown' }}</p>
            </div>

            <!-- Add new card -->
            <NuxtLink to="/songs/add" class="w-40 shrink-0">
              <div class="w-40 h-40 rounded-2xl border-2 border-dashed border-border hover:border-accent/50 flex items-center justify-center mb-3 transition-colors group">
                <div class="text-center">
                  <div class="w-10 h-10 bg-surface rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/10 transition-colors">
                    <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <p class="text-xs text-muted group-hover:text-muted-light transition-colors">Add Song</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- STATS -->
        <section class="mb-10">
          <h2 class="text-xs font-bold uppercase tracking-widest text-muted-light mb-5">Library Stats</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="stat in stats" :key="stat.label" class="bg-surface border border-border rounded-2xl p-5">
              <p class="text-muted text-xs font-semibold uppercase tracking-wider mb-1">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-white">{{ stat.value }}</p>
            </div>
          </div>
        </section>

        <!-- APP RELEASE -->
        <section>
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-xs font-bold uppercase tracking-widest text-muted-light">App Distribution</h2>
            <NuxtLink to="/release" class="text-xs font-bold tracking-widest text-accent hover:text-accent-dark transition-colors">MANAGE</NuxtLink>
          </div>

          <div class="bg-surface border border-border rounded-2xl p-5 flex items-center gap-5">
            <!-- Icon -->
            <div class="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center shrink-0">
              <svg class="w-7 h-7 text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 mb-0.5">
                <span class="text-2xl font-bold text-white">{{ formatCount(release?.download_count ?? 0) }}</span>
                <span class="text-muted text-sm">downloads</span>
              </div>
              <p class="text-xs text-muted-light">
                <span v-if="release?.apk_url">
                  v{{ release.version }} · <span class="text-green-400">Live</span>
                </span>
                <span v-else class="text-red-400">No APK set — click Manage to upload</span>
              </p>
            </div>

            <div class="flex gap-2 shrink-0">
              <NuxtLink
                to="/download"
                target="_blank"
                class="text-xs bg-border/60 hover:bg-accent/20 hover:text-accent text-muted-light px-3 py-2 rounded-xl font-semibold transition-colors"
              >
                Preview
              </NuxtLink>
              <NuxtLink
                to="/release"
                class="text-xs bg-accent hover:bg-accent-dark text-black px-3 py-2 rounded-xl font-semibold transition-colors"
              >
                Edit
              </NuxtLink>
            </div>
          </div>
        </section>
      </div>

      <!-- Right sidebar -->
      <aside class="w-72 shrink-0 hidden lg:block">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xs font-bold uppercase tracking-widest text-muted-light">All Songs</h2>
          <NuxtLink to="/songs" class="text-xs font-bold tracking-widest text-accent hover:text-accent-dark transition-colors">VIEW ALL</NuxtLink>
        </div>

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 8" :key="i" class="bg-surface border border-border rounded-xl h-16 animate-pulse" />
        </div>

        <div v-else class="space-y-1">
          <NuxtLink
            v-for="song in sidebarSongs"
            :key="song.id"
            :to="`/songs/${song.id}`"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface group transition-colors"
          >
            <div
              class="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
              :style="{ background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})` }"
            >
              <svg class="w-5 h-5 text-white opacity-60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/>
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">{{ song.title }}</p>
              <p class="text-xs text-muted truncate">{{ song.artist || 'Unknown' }}</p>
            </div>
            <span :class="diffDot(song.difficulty)" class="w-2 h-2 rounded-full shrink-0" />
          </NuxtLink>

          <div v-if="songs.length === 0" class="text-center py-12">
            <p class="text-muted text-sm">No songs yet.</p>
            <NuxtLink to="/songs/add" class="text-accent text-sm hover:underline mt-1 inline-block">Add one →</NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

// SVG icon components
const IconHeart = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' })]) })
const IconMusic = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z' })]) })
const IconStar = defineComponent({ render: () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' })]) })
const IconZap = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', viewBox: '0 0 24 24' }, [h('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })]) })
const IconTrendingUp = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', viewBox: '0 0 24 24' }, [h('polyline', { points: '23 6 13.5 15.5 8.5 10.5 1 18' }), h('polyline', { points: '17 6 23 6 23 12' })]) })
const IconAward = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', viewBox: '0 0 24 24' }, [h('circle', { cx: '12', cy: '8', r: '6' }), h('path', { d: 'M15.477 12.89 17 22l-5-3-5 3 1.523-9.11' })]) })

const { songs, loading, error, fetchSongs } = useSongs()
const { release, fetchRelease } = useRelease()

await Promise.all([fetchSongs(), fetchRelease()])

const recent = computed(() => songs.value.slice(0, 10))
const sidebarSongs = computed(() => songs.value.slice(0, 12))

const stats = computed(() => [
  { label: 'Total Songs', value: songs.value.length },
  { label: 'Beginner', value: songs.value.filter((s) => s.difficulty === 'Beginner').length },
  { label: 'Intermediate', value: songs.value.filter((s) => s.difficulty === 'Intermediate').length },
  { label: 'Advanced', value: songs.value.filter((s) => s.difficulty === 'Advanced').length },
])

const collections = computed(() => [
  { label: 'Your Most Played', icon: IconHeart,      bg: 'bg-gradient-to-br from-purple-600 to-indigo-700', filter: '',             count: songs.value.length },
  { label: 'Most Popular',     icon: IconMusic,      bg: 'bg-gradient-to-br from-teal-500 to-cyan-700',    filter: '',             count: songs.value.length },
  { label: 'Beginner',         icon: IconStar,       bg: 'bg-gradient-to-br from-green-500 to-emerald-700', filter: 'Beginner',    count: songs.value.filter((s) => s.difficulty === 'Beginner').length },
  { label: 'Intermediate',     icon: IconZap,        bg: 'bg-gradient-to-br from-orange-500 to-red-600',   filter: 'Intermediate', count: songs.value.filter((s) => s.difficulty === 'Intermediate').length },
  { label: 'Trending',         icon: IconTrendingUp, bg: 'bg-gradient-to-br from-pink-500 to-rose-700',    filter: '',             count: songs.value.length },
  { label: 'Your Top Rated',   icon: IconAward,      bg: 'bg-gradient-to-br from-yellow-400 to-amber-600', filter: '',             count: songs.value.length },
])

function diffDot(d: string) {
  return { Beginner: 'bg-green-500', Intermediate: 'bg-orange-500', Advanced: 'bg-red-500' }[d] ?? 'bg-border'
}

function goToSongs(_filter: string) {
  navigateTo('/songs')
}

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
