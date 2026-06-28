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
        <span class="font-bold text-xl tracking-tight text-white">GuitarChords<span class="text-accent">.</span>admin</span>
      </div>

      <!-- Success state -->
      <div v-if="success" class="bg-surface border border-border rounded-2xl p-8 text-center">
        <div class="w-14 h-14 bg-green-950/50 border border-green-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <h2 class="text-lg font-bold text-white mb-2">Check your email</h2>
        <p class="text-muted text-sm mb-6">We sent a confirmation link to <span class="text-white font-medium">{{ email }}</span>. Click it to activate your account.</p>
        <NuxtLink to="/login" class="text-accent text-sm font-medium hover:underline">Back to login</NuxtLink>
      </div>

      <!-- Register form -->
      <div v-else class="bg-surface border border-border rounded-2xl p-8">
        <h1 class="text-xl font-bold text-white mb-1">Create admin account</h1>
        <p class="text-muted text-sm mb-6">You need an admin code to register</p>

        <form @submit.prevent="handleRegister" class="space-y-4">
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
              minlength="8"
              placeholder="Min. 8 characters"
              class="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-muted-light uppercase tracking-wider mb-2">Admin Code</label>
            <input
              v-model="adminCode"
              type="password"
              required
              placeholder="Enter admin access code"
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
            {{ loading ? 'Creating account…' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-muted text-sm mt-6">
          Already have an account?
          <NuxtLink to="/login" class="text-accent hover:text-accent-dark transition-colors font-medium">Sign in</NuxtLink>
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
const adminCode = ref('')
const loading = ref(false)
const errorMsg = ref('')
const success = ref(false)

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''

  // Validate admin code server-side first
  const { valid, error: codeError } = await $fetch<{ valid: boolean; error?: string }>(
    '/api/validate-admin-code',
    { method: 'POST', body: { code: adminCode.value } }
  ).catch(() => ({ valid: false, error: 'Server error. Try again.' }))

  if (!valid) {
    errorMsg.value = codeError ?? 'Invalid admin code.'
    loading.value = false
    return
  }

  // Sign up — Supabase sends confirmation email automatically
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  loading.value = false
  if (error) {
    errorMsg.value = error.message
  } else {
    success.value = true
  }
}
</script>
