<template>
  <div class="min-h-screen bg-bg text-white font-sans flex flex-col">
    <!-- Minimal nav -->
    <nav class="border-b border-border px-6 h-14 flex items-center">
      <div class="flex items-center gap-2">
        <img src="/icon.png" class="w-7 h-7" alt="Guitar Chords and Lyrics" />
        <span class="font-bold text-base tracking-tight">Guitar Chords and Lyrics</span>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md text-center">

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>

        <!-- No release yet -->
        <div v-else-if="!release?.apk_url" class="py-20">
          <div class="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
          </div>
          <p class="text-muted-light font-medium">No release available yet</p>
          <p class="text-muted text-sm mt-1">Check back soon.</p>
        </div>

        <!-- Release available -->
        <div v-else>
          <!-- App icon -->
          <img src="/icon.png" class="w-24 h-24 rounded-3xl mx-auto mb-6" alt="Guitar Chords and Lyrics" />

          <h1 class="text-3xl font-bold text-white mb-1">Guitar Chords and Lyrics</h1>
          <p class="text-muted-light text-sm mb-6">Learn guitar songs with chords & lyrics</p>

          <!-- Meta pills -->
          <div class="flex items-center justify-center gap-2 flex-wrap mb-8">
            <span class="bg-surface border border-border text-muted-light text-xs px-3 py-1.5 rounded-full font-medium">
              v{{ release.version }}
            </span>
            <span v-if="release.file_size" class="bg-surface border border-border text-muted-light text-xs px-3 py-1.5 rounded-full font-medium">
              {{ release.file_size }}
            </span>
            <span class="bg-surface border border-border text-muted-light text-xs px-3 py-1.5 rounded-full font-medium">
              Android APK
            </span>
          </div>

          <!-- Download count -->
          <div class="bg-surface border border-border rounded-2xl p-6 mb-6 inline-block min-w-48">
            <p class="text-4xl font-bold text-white mb-0.5">{{ formatCount(localCount) }}</p>
            <p class="text-muted text-sm">total downloads</p>
          </div>

          <!-- Download button -->
          <div class="mb-6">
            <button
              @click="handleDownload"
              :disabled="downloading"
              class="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark disabled:opacity-60 text-black font-bold py-4 px-6 rounded-2xl text-base transition-colors"
            >
              <svg v-if="!downloading" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              <div v-else class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              {{ downloading ? 'Preparing download…' : 'Download APK' }}
            </button>
            <p class="text-muted text-xs mt-3">Android only · Enable "Install unknown apps" before installing</p>
          </div>

          <!-- Changelog -->
          <div v-if="release.changelog" class="bg-surface border border-border rounded-2xl p-5 text-left">
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-light mb-3">What's New in v{{ release.version }}</h3>
            <p class="text-sm text-muted-light whitespace-pre-line leading-relaxed">{{ release.changelog }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-border px-4 py-6 text-center">
      <p class="text-muted text-xs space-x-4">
        <NuxtLink to="/privacy" class="hover:text-muted-light transition-colors">Privacy Policy</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-muted-light transition-colors">Terms of Service</NuxtLink>
        <NuxtLink to="/support" class="hover:text-muted-light transition-colors">Support</NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { release, loading, fetchRelease } = useRelease()
const downloading = ref(false)
const localCount = ref(0)

await fetchRelease()
localCount.value = release.value?.download_count ?? 0

async function handleDownload() {
  downloading.value = true
  try {
    const { url } = await $fetch<{ url: string }>('/api/download', { method: 'POST' })
    localCount.value += 1
    window.location.href = url
  } catch (e: any) {
    alert(e?.data?.message ?? 'Download failed. Please try again.')
  } finally {
    downloading.value = false
  }
}

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}
</script>
