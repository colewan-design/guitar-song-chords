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
              @keyup.enter="handleSearch"
            />
          </div>
        </div>

        <!-- Nav links -->
        <div class="flex items-center gap-6 text-sm font-medium ml-auto">
          <NuxtLink to="/songs" class="text-muted-light hover:text-white transition-colors">Songs</NuxtLink>
          <NuxtLink to="/songs/add" class="bg-accent hover:bg-accent-dark text-black px-5 py-2 rounded-full font-semibold transition-colors text-sm">
            + Add Song
          </NuxtLink>
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
const searchQuery = ref('')

function handleSearch() {
  // search is reactive, no action needed
}
</script>
