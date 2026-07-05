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

        <!-- Release available -->
        <div v-else>
          <!-- App icon -->
          <img src="/icon.png" class="w-24 h-24 rounded-3xl mx-auto mb-6" alt="Guitar Chords and Lyrics" />

          <h1 class="text-3xl font-bold text-white mb-1">Guitar Chords and Lyrics</h1>
          <p class="text-muted-light text-sm mb-6">Learn guitar songs with chords & lyrics</p>

          <!-- Meta pills -->
          <div class="flex items-center justify-center gap-2 flex-wrap mb-8">
            <span v-if="release?.version" class="bg-surface border border-border text-muted-light text-xs px-3 py-1.5 rounded-full font-medium">
              v{{ release.version }}
            </span>
            <span class="bg-surface border border-border text-muted-light text-xs px-3 py-1.5 rounded-full font-medium">
              Closed Testing
            </span>
          </div>

          <!-- Requested access count -->
          <div class="bg-surface border border-border rounded-2xl p-6 mb-6 inline-block min-w-48">
            <p class="text-4xl font-bold text-white mb-0.5">{{ formatCount(requestCount) }}</p>
            <p class="text-muted text-sm">people requested access</p>
          </div>

          <!-- Request access form -->
          <div class="mb-6">
            <p class="text-muted-light text-sm mb-4">
              The app is currently in closed testing on the Play Store. Drop your email and we'll add you as a tester and send you the invite link.
            </p>

            <div v-if="requested" class="bg-surface border border-border rounded-2xl p-5">
              <p class="text-white font-medium">You're on the list!</p>
              <p class="text-muted text-sm mt-1">We'll email you an invite once you've been added as a tester.</p>
            </div>

            <form v-else @submit.prevent="handleRequestAccess" class="flex flex-col gap-3">
              <input
                v-model="email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-base text-white placeholder-muted focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                :disabled="submitting"
                class="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark disabled:opacity-60 text-black font-bold py-4 px-6 rounded-2xl text-base transition-colors"
              >
                <div v-if="submitting" class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {{ submitting ? 'Submitting…' : 'Request Access' }}
              </button>
              <p v-if="requestError" class="text-red-400 text-xs">{{ requestError }}</p>
            </form>
          </div>

          <!-- Changelog -->
          <div v-if="release?.changelog" class="bg-surface border border-border rounded-2xl p-5 text-left">
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
const email = ref('')
const submitting = ref(false)
const requested = ref(false)
const requestError = ref<string | null>(null)
const requestCount = ref(0)

await fetchRelease()
try {
  const { count } = await $fetch<{ count: number }>('/api/request-access')
  requestCount.value = count
} catch {
  // Non-critical — just leave the count at 0 if this fails.
}

async function handleRequestAccess() {
  submitting.value = true
  requestError.value = null
  try {
    const { count } = await $fetch<{ success: boolean; count: number }>('/api/request-access', {
      method: 'POST',
      body: { email: email.value },
    })
    requestCount.value = count
    requested.value = true
  } catch (e: any) {
    requestError.value = e?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}
</script>
