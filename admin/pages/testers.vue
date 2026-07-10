<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Testers</h1>
        <p class="text-muted text-sm mt-1">{{ requests.length }} people requested access</p>
      </div>
      <button
        v-if="requests.length > 0"
        @click="copyAll"
        class="bg-accent hover:bg-accent-dark text-black px-5 py-2 rounded-full font-semibold text-sm transition-colors"
      >
        {{ copiedAll ? 'Copied!' : 'Copy all emails' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-950/40 border border-red-800/50 text-red-400 rounded-2xl p-5 text-sm">{{ error }}</div>

    <!-- Empty -->
    <div v-else-if="requests.length === 0" class="text-center py-24">
      <div class="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
        </svg>
      </div>
      <p class="text-muted-light font-medium mb-1">No requests yet</p>
      <p class="text-muted text-sm">Share your download page link to start collecting testers.</p>
    </div>

    <!-- List -->
    <div v-else class="bg-surface border border-border rounded-2xl overflow-hidden">
      <div
        v-for="(req, i) in requests"
        :key="req.email"
        class="flex items-center justify-between gap-4 px-5 py-4"
        :class="{ 'border-t border-border': i > 0 }"
      >
        <div class="min-w-0">
          <p class="text-white font-medium truncate">{{ req.email }}</p>
          <p class="text-muted text-xs mt-0.5">{{ formatDate(req.created_at) }}</p>
        </div>
        <button
          @click="copyOne(req.email)"
          class="shrink-0 text-xs bg-border/60 hover:bg-accent/20 hover:text-accent text-muted-light px-3 py-2 rounded-xl font-semibold transition-colors"
        >
          {{ copiedEmail === req.email ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <p v-if="requests.length > 0" class="text-muted text-xs mt-4">
      Paste these into Play Console → Testing → Closed testing → Testers → Create email list.
    </p>
  </div>
</template>

<script setup lang="ts">
interface AccessRequest {
  email: string
  created_at: string
}

const requests = ref<AccessRequest[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const copiedEmail = ref<string | null>(null)
const copiedAll = ref(false)

try {
  const { requests: data } = await $fetch<{ requests: AccessRequest[] }>('/api/testers')
  requests.value = data
} catch (e: any) {
  error.value = e?.data?.message ?? 'Failed to load testers.'
} finally {
  loading.value = false
}

async function copyOne(email: string) {
  await navigator.clipboard.writeText(email)
  copiedEmail.value = email
  setTimeout(() => { if (copiedEmail.value === email) copiedEmail.value = null }, 1500)
}

async function copyAll() {
  await navigator.clipboard.writeText(requests.value.map((r) => r.email).join(', '))
  copiedAll.value = true
  setTimeout(() => { copiedAll.value = false }, 1500)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
