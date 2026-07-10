<template>
  <div class="min-h-screen bg-bg text-white font-sans">
    <!-- Navbar -->
    <nav class="bg-bg border-b border-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-6">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <img src="/icon.png" class="w-8 h-8" alt="Guitar Chords and Lyrics" />
          <span class="hidden sm:inline font-bold text-lg tracking-tight text-white">Guitar Chords and Lyrics</span>
        </NuxtLink>

        <!-- Search -->
        <div class="flex-1 min-w-0 max-w-md hidden md:block">
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

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-4 text-sm font-medium ml-auto">
          <NuxtLink to="/songs" class="text-muted-light hover:text-white transition-colors">Songs</NuxtLink>
          <NuxtLink to="/testers" class="text-muted-light hover:text-white transition-colors">Testers</NuxtLink>
          <NuxtLink to="/download" class="text-muted-light hover:text-white transition-colors">Download</NuxtLink>
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

        <!-- Mobile menu toggle -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden ml-auto w-9 h-9 flex items-center justify-center bg-surface border border-border rounded-lg text-muted-light hover:text-white transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile menu panel -->
      <Transition name="fade">
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-border px-4 py-4 space-y-4">
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

          <div class="flex flex-col gap-1 text-sm font-medium">
            <NuxtLink @click="mobileMenuOpen = false" to="/songs" class="px-2 py-2 rounded-lg text-muted-light hover:text-white hover:bg-surface transition-colors">Songs</NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/testers" class="px-2 py-2 rounded-lg text-muted-light hover:text-white hover:bg-surface transition-colors">Testers</NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/download" class="px-2 py-2 rounded-lg text-muted-light hover:text-white hover:bg-surface transition-colors">Download</NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/songs/add" class="mt-1 text-center bg-accent hover:bg-accent-dark text-black px-5 py-2.5 rounded-full font-semibold transition-colors">
              + Add Song
            </NuxtLink>
          </div>

          <div v-if="user" class="border-t border-border pt-4">
            <p class="text-xs text-muted mb-2">Signed in as <span class="text-muted-light">{{ user.email }}</span></p>
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-left"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Page content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const searchQuery = ref('')
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const mobileMenuOpen = ref(false)

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
