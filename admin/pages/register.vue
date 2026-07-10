<template>
  <div class="min-h-screen bg-bg flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <img src="/icon.png" class="w-9 h-9" alt="Guitar Chords and Lyrics" />
        <span class="font-bold text-xl tracking-tight text-white">Guitar Chords and Lyrics</span>
      </div>

      <!-- Step 1: Email + Password -->
      <div v-if="step === 1" class="bg-surface border border-border rounded-2xl p-8">
        <h1 class="text-xl font-bold text-white mb-1">Create account</h1>
        <p class="text-muted text-sm mb-6">Enter your email and password to get started</p>

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

          <div v-if="errorMsg" class="bg-red-950/40 border border-red-800/50 text-red-400 rounded-xl px-4 py-3 text-sm">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-black font-bold py-3 rounded-xl text-sm transition-colors mt-2"
          >
            {{ loading ? 'Sending code…' : 'Continue' }}
          </button>
        </form>

        <p class="text-center text-muted text-sm mt-6">
          Already have an account?
          <NuxtLink to="/login" class="text-accent hover:text-accent-dark transition-colors font-medium">Sign in</NuxtLink>
        </p>
      </div>

      <!-- Step 2: OTP Verification -->
      <div v-else-if="step === 2" class="bg-surface border border-border rounded-2xl p-8">
        <button @click="step = 1" class="flex items-center gap-1 text-muted hover:text-white text-sm mb-6 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <div class="w-12 h-12 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>

        <h1 class="text-xl font-bold text-white mb-1">Check your email</h1>
        <p class="text-muted text-sm mb-6">
          We sent a 6-digit code to <span class="text-white font-medium">{{ email }}</span>
        </p>

        <form @submit.prevent="handleVerify" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-muted-light uppercase tracking-wider mb-3">Verification code</label>
            <div class="flex gap-2 justify-between">
              <input
                v-for="(_, i) in otp"
                :key="i"
                :ref="el => otpRefs[i] = el"
                v-model="otp[i]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                @input="onOtpInput(i, $event)"
                @keydown.backspace="onOtpBackspace(i)"
                @paste.prevent="onOtpPaste($event)"
                class="w-11 h-14 text-center text-xl font-bold bg-card border border-border rounded-xl text-white focus:outline-none focus:border-accent/60 transition-colors"
              />
            </div>
          </div>

          <div v-if="errorMsg" class="bg-red-950/40 border border-red-800/50 text-red-400 rounded-xl px-4 py-3 text-sm">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="loading || otp.join('').length < 6"
            class="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-black font-bold py-3 rounded-xl text-sm transition-colors"
          >
            {{ loading ? 'Verifying…' : 'Confirm Account' }}
          </button>
        </form>

        <p class="text-center text-muted text-sm mt-6">
          Didn't receive it?
          <button @click="resend" :disabled="resendCooldown > 0" class="text-accent hover:text-accent-dark transition-colors font-medium disabled:opacity-50">
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
          </button>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()

const step = ref(1)
const email = ref('')
const password = ref('')
const otp = ref(['', '', '', '', '', ''])
const otpRefs = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref('')
const resendCooldown = ref(0)

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: { emailRedirectTo: undefined },
  })

  loading.value = false
  if (error) {
    errorMsg.value = error.message
  } else {
    step.value = 2
    startCooldown()
  }
}

async function handleVerify() {
  loading.value = true
  errorMsg.value = ''

  const token = otp.value.join('')
  const { error } = await supabase.auth.verifyOtp({
    email: email.value,
    token,
    type: 'signup',
  })

  loading.value = false
  if (error) {
    errorMsg.value = error.message
    otp.value = ['', '', '', '', '', '']
    nextTick(() => otpRefs.value[0]?.focus())
  } else {
    window.location.href = '/'
  }
}

async function resend() {
  errorMsg.value = ''
  const { error } = await supabase.auth.resend({ type: 'signup', email: email.value })
  if (error) {
    errorMsg.value = error.message
  } else {
    startCooldown()
  }
}

function startCooldown() {
  resendCooldown.value = 60
  const t = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(t)
  }, 1000)
}

function onOtpInput(i: number, e: Event) {
  const val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  otp.value[i] = val.slice(-1)
  if (val && i < 5) nextTick(() => otpRefs.value[i + 1]?.focus())
}

function onOtpBackspace(i: number) {
  if (!otp.value[i] && i > 0) {
    otp.value[i - 1] = ''
    nextTick(() => otpRefs.value[i - 1]?.focus())
  }
}

function onOtpPaste(e: ClipboardEvent) {
  const digits = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? ''
  digits.split('').forEach((d, i) => { otp.value[i] = d })
  nextTick(() => otpRefs.value[Math.min(digits.length, 5)]?.focus())
}
</script>
