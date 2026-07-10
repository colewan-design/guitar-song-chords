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
        <img src="/icon.png" class="w-20 h-20 rounded-3xl mx-auto mb-6" alt="Guitar Chords and Lyrics" />

        <h1 class="text-2xl font-bold text-white mb-2">Become a Tester</h1>
        <p class="text-muted-light text-sm mb-8">
          The app is in closed testing on the Play Store. Submit your Gmail account and we'll add you as a tester and send you the invite link.
        </p>

        <div v-if="registered" class="bg-surface border border-border rounded-2xl p-6">
          <p class="text-white font-medium">You're on the list!</p>
          <p class="text-muted text-sm mt-1">We'll email you an invite once you've been added as a tester.</p>
        </div>

        <form v-else @submit.prevent="handleRegister" class="flex flex-col gap-3">
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@gmail.com"
            class="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-base text-white placeholder-muted focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            :disabled="submitting"
            class="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark disabled:opacity-60 text-black font-bold py-4 px-6 rounded-2xl text-base transition-colors"
          >
            <div v-if="submitting" class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            {{ submitting ? 'Submitting…' : 'Register as Tester' }}
          </button>
          <p v-if="registerError" class="text-red-400 text-xs">{{ registerError }}</p>
          <p class="text-muted text-xs mt-1">Must be a Gmail (or Google Workspace) account — that's what Play Console uses to add testers.</p>
        </form>
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

const email = ref('')
const submitting = ref(false)
const registered = ref(false)
const registerError = ref<string | null>(null)

async function handleRegister() {
  submitting.value = true
  registerError.value = null
  try {
    await $fetch('/api/request-access', {
      method: 'POST',
      body: { email: email.value },
    })
    registered.value = true
  } catch (e: any) {
    registerError.value = e?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
