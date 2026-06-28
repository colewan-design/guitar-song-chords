<template>
  <div class="min-h-screen bg-bg flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/>
          </svg>
        </div>
        <span class="font-bold text-xl tracking-tight text-white">Guitar Songs Chords</span>
      </div>

      <div class="bg-surface border border-border rounded-2xl p-8">
        <h1 class="text-xl font-bold text-white mb-1">Welcome back</h1>
        <p class="text-muted text-sm mb-6">Sign in to your admin account</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-muted-light uppercase tracking-wider mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@example.com"
              class="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-muted-light uppercase tracking-wider mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div v-if="errorMsg" class="bg-red-950/40 border border-red-800/50 text-red-400 rounded-xl px-4 py-3 text-sm">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-black font-bold py-3 rounded-xl text-sm transition-colors mt-2"
          >
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-muted text-sm mt-6">
          Need access?
          <NuxtLink to="/register" class="text-accent hover:text-accent-dark transition-colors font-medium">Request an account</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
  } else {
    await navigateTo('/')
  }
}
</script>
