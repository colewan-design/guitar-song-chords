<template>
  <div class="min-h-screen bg-bg text-white font-sans">
    <!-- Navbar -->
    <nav class="bg-bg border-b border-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/>
            </svg>
          </div>
          <span class="font-bold text-lg tracking-tight text-white">GuitarChords<span class="text-accent">.</span>admin</span>
        </NuxtLink>

        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search songs, artists, genres"
              class="w-full bg-surface border border-border rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>

        <!-- Nav links -->
        <div class="flex items-center gap-4 text-sm font-medium ml-auto">
          <NuxtLink to="/songs" class="text-muted-light hover:text-white transition-colors">Songs</NuxtLink>
          <NuxtLink to="/songs/add" class="bg-accent hover:bg-accent-dark text-black px-5 py-2 rounded-full font-semibold transition-colors text-sm">
            + Add Song
          </NuxtLink>

          <!-- User menu -->
          <div v-if="user" class="relative" ref="menuRef">
            <button
              @click="menuOpen = !menuOpen"
              class="flex items-center gap-2 bg-surface border border-border hover:border-accent/40 rounded-full pl-3 pr-1 py-1 transition-colors"
            >
              <span class="text-xs text-muted-light max-w-32 truncate">{{ user.email }}</span>
              <div class="w-7 h-7 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </button>

            <!-- Dropdown -->
            <Transition name="fade">
              <div v-if="menuOpen" class="absolute right-0 top-full mt-2 w-44 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
                <div class="px-4 py-3 border-b border-border">
                  <p class="text-xs text-muted">Signed in as</p>
                  <p class="text-sm text-white font-medium truncate">{{ user.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-950/30 transition-colors text-left"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <NuxtPage :search-query="searchQuery" />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const searchQuery = ref('')
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
      menuOpen.value = false
    }
  })
})

async function handleLogout() {
  menuOpen.value = false
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
