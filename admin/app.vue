<template>
  <div class="min-h-screen bg-bg text-white">
    <nav class="bg-surface border-b border-border sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-white">
          <span class="text-accent">♪</span> Guitar Chords Admin
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-sm text-muted hover:text-white transition-colors">Songs</NuxtLink>
          <NuxtLink to="/songs/add" class="text-sm bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            + Add Song
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>
