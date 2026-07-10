<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/" class="text-muted hover:text-white transition-colors text-sm">← Home</NuxtLink>
      <span class="text-border">/</span>
      <h1 class="text-xl font-bold">App Release</h1>
    </div>

    <!-- Download stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-surface border border-border rounded-2xl p-5 col-span-2 sm:col-span-1">
        <p class="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Total Downloads</p>
        <p class="text-3xl font-bold text-white">{{ formatCount(release?.download_count ?? 0) }}</p>
      </div>
      <div class="bg-surface border border-border rounded-2xl p-5">
        <p class="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Version</p>
        <p class="text-3xl font-bold text-white">{{ release?.version ?? '—' }}</p>
      </div>
      <div class="bg-surface border border-border rounded-2xl p-5">
        <p class="text-muted text-xs font-semibold uppercase tracking-wider mb-1">APK Status</p>
        <p class="text-lg font-bold mt-1" :class="release?.apk_url ? 'text-green-400' : 'text-red-400'">
          {{ release?.apk_url ? 'Live' : 'Not set' }}
        </p>
      </div>
    </div>

    <!-- Public download link -->
    <div v-if="release?.apk_url" class="bg-surface border border-border rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
      <div class="min-w-0">
        <p class="text-xs font-semibold text-muted-light uppercase tracking-wider mb-1">Public Download Page</p>
        <p class="text-sm text-accent truncate">{{ pageUrl }}</p>
      </div>
      <button
        @click="copyLink"
        class="shrink-0 bg-border/60 hover:bg-accent/20 hover:text-accent text-muted-light text-xs px-4 py-2 rounded-xl font-semibold transition-colors"
      >
        {{ copied ? 'Copied!' : 'Copy Link' }}
      </button>
    </div>

    <!-- Edit form -->
    <div class="bg-surface border border-border rounded-2xl p-6 space-y-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-muted-light">Release Details</h2>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Version *</label>
          <input
            v-model="form.version"
            type="text"
            placeholder="1.0.0"
            class="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">File Size</label>
          <input
            v-model="form.file_size"
            type="text"
            placeholder="e.g. 48 MB"
            class="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">APK File</label>
        <input ref="fileInput" type="file" accept=".apk" class="hidden" @change="handleFileChange" />
        <button
          @click="fileInput?.click()"
          :disabled="uploading"
          class="w-full flex items-center justify-center gap-2 bg-card border border-dashed border-border hover:border-accent/50 rounded-xl px-4 py-4 text-sm text-muted-light hover:text-white transition-colors disabled:opacity-50"
        >
          <svg v-if="!uploading" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
          </svg>
          <div v-else class="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          {{ uploading ? `Uploading… ${uploadProgress}%` : (form.apk_url ? 'Replace APK' : 'Upload APK') }}
        </button>
        <p v-if="uploadError" class="text-xs text-red-400 mt-1.5">{{ uploadError }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">APK URL *</label>
        <input
          v-model="form.apk_url"
          type="url"
          placeholder="https://..."
          class="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
        />
        <p class="text-xs text-muted mt-1.5">Auto-filled after upload, or paste a direct link manually.</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-accent uppercase tracking-wider mb-2">Changelog</label>
        <textarea
          v-model="form.changelog"
          rows="5"
          placeholder="- Fixed chord rendering&#10;- Added new songs&#10;- Improved search"
          class="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted font-mono focus:outline-none focus:border-accent/60 resize-y transition-colors"
        />
      </div>

      <div v-if="error" class="bg-red-950/40 border border-red-800/50 text-red-400 rounded-xl px-4 py-3 text-sm">{{ error }}</div>

      <div class="flex gap-3 pt-1">
        <NuxtLink to="/" class="flex-1 text-center bg-border/60 hover:bg-border text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Cancel
        </NuxtLink>
        <button
          @click="handleSave"
          :disabled="saving"
          class="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          {{ saving ? 'Saving…' : 'Save Release' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { release, loading, error, fetchRelease, upsertRelease } = useRelease()
const { show: showSnack } = useSnackbar()

const saving = ref(false)
const copied = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  version: '',
  apk_url: '',
  file_size: '',
  changelog: '',
})

await fetchRelease()

if (release.value) {
  form.version = release.value.version ?? ''
  form.apk_url = release.value.apk_url ?? ''
  form.file_size = release.value.file_size ?? ''
  form.changelog = release.value.changelog ?? ''
}

const pageUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/download`
})

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  try {
    // Get a signed URL from the server (uses service role key, bypasses RLS)
    const { signedUrl } = await $fetch<{ signedUrl: string }>('/api/upload-apk-url', { method: 'POST' })

    // Upload directly from browser to Supabase — no Vercel size limit
    const res = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': 'application/vnd.android.package-archive' },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Upload failed.')
    }

    const supabase = useSupabaseClient()
    const { data } = supabase.storage.from('releases').getPublicUrl('app-release.apk')
    form.apk_url = data.publicUrl
    form.file_size = (file.size / 1024 / 1024).toFixed(1) + ' MB'
    showSnack('APK uploaded successfully')
  } catch (err: any) {
    uploadError.value = err?.message ?? 'Upload failed.'
    showSnack(uploadError.value, 'error')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleSave() {
  saving.value = true
  const ok = await upsertRelease({ ...form })
  saving.value = false
  if (ok) showSnack('Release saved')
  else showSnack(error.value ?? 'Failed to save', 'error')
}

async function copyLink() {
  await navigator.clipboard.writeText(pageUrl.value)
  copied.value = true
  showSnack('Link copied to clipboard')
  setTimeout(() => { copied.value = false }, 2000)
}

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}
</script>
