<template>
  <div class="min-h-screen bg-bg text-white font-sans flex flex-col">
    <!-- Minimal nav -->
    <nav class="border-b border-border px-6 h-14 flex items-center">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/icon.png" class="w-7 h-7" alt="Guitar Chords and Lyrics" />
        <span class="font-bold text-base tracking-tight">Guitar Chords and Lyrics</span>
      </NuxtLink>
    </nav>

    <!-- Main content -->
    <div class="flex-1 px-4 py-16">
      <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-white mb-1">Support</h1>
        <p class="text-muted text-sm mb-8">Need help with Guitar Chords and Lyrics? We're happy to help.</p>

        <div class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-light">
          <section>
            <h2 class="text-white font-bold text-base mb-2">Contact us</h2>
            <p>
              For bug reports, feature requests, or any other questions, email us at
              <a href="mailto:christiancolewan@gmail.com" class="text-accent hover:text-accent-dark transition-colors">christiancolewan@gmail.com</a>
              and we'll get back to you as soon as we can.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Common questions</h2>
            <div class="space-y-4">
              <div>
                <p class="text-white font-semibold mb-1">How do I add my own song?</p>
                <p>Open the app, go to the Add Song screen, and enter the title, artist, and chord sheet.</p>
              </div>
              <div>
                <p class="text-white font-semibold mb-1">Where are my recordings saved?</p>
                <p>Recordings made in the app are saved locally on your device only and are never uploaded anywhere.</p>
              </div>
              <div>
                <p class="text-white font-semibold mb-1">Do I need an account?</p>
                <p>No. The app works fully offline for saved songs, favourites, and recordings — no sign-in required.</p>
              </div>
              <div>
                <p class="text-white font-semibold mb-1">I found an error in a chord sheet. What should I do?</p>
                <p>Email us the song title and artist and we'll take a look.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">More</h2>
            <p>
              See our <NuxtLink to="/privacy" class="text-accent hover:text-accent-dark transition-colors">Privacy Policy</NuxtLink>
              and <NuxtLink to="/terms" class="text-accent hover:text-accent-dark transition-colors">Terms of Service</NuxtLink>.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>
