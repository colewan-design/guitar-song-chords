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
        <h1 class="text-3xl font-bold text-white mb-1">Terms of Service</h1>
        <p class="text-muted text-sm mb-8">Last updated: July 4, 2026</p>

        <div class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-light">
          <p>
            These terms govern your use of Guitar Chords and Lyrics ("the app"), developed by Teekunana.
            By installing or using the app, you agree to these terms.
          </p>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Use of the app</h2>
            <p>
              The app is provided for personal, non-commercial use to help you learn and practice guitar
              songs. You may not redistribute, resell, or reverse engineer the app.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Custom songs you add</h2>
            <p>
              The app lets you add your own chord sheets and lyrics for personal use. You are responsible
              for making sure any content you enter does not infringe someone else's copyright.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">No warranty</h2>
            <p>
              The app is provided "as is" without warranties of any kind. We do not guarantee that chord
              sheets and lyrics are error-free or that the app will always be available or free of bugs.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Limitation of liability</h2>
            <p>
              To the extent permitted by law, we are not liable for any damages arising from your use of
              the app.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Changes</h2>
            <p>
              We may update the app or these terms from time to time. Continued use of the app after a
              change means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Contact</h2>
            <p>
              Questions about these terms can be sent to
              <a href="mailto:christiancolewan@gmail.com" class="text-accent hover:text-accent-dark transition-colors">christiancolewan@gmail.com</a>.
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
