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
        <h1 class="text-3xl font-bold text-white mb-1">Privacy Policy</h1>
        <p class="text-muted text-sm mb-8">Last updated: July 4, 2026</p>

        <div class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-light">
          <p>
            Guitar Chords and Lyrics ("the app") is developed by Teekunana. This policy explains what
            information the app handles and how it is used.
          </p>

          <section>
            <h2 class="text-white font-bold text-base mb-2">No account required</h2>
            <p>
              The app does not require you to create an account or sign in, and it does not collect your
              name, email address, or any other personal identifiers.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Microphone &amp; recordings</h2>
            <p>
              If you use the recording feature, the app requests microphone access so you can record
              yourself playing. Recordings are saved only in local storage on your device and are never
              uploaded, transmitted, or shared with us or any third party.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Song data</h2>
            <p>
              The app fetches chord sheets and lyrics from our hosted database using an anonymous,
              read-only connection. This request does not include any personal information about you.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Locally stored data</h2>
            <p>
              Your favourites, app settings, custom songs, and font-size preferences are stored locally on
              your device only. This data is not transmitted to us and is removed if you uninstall the app.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Third parties</h2>
            <p>
              The app does not contain advertising and does not use third-party analytics or tracking
              SDKs.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Children's privacy</h2>
            <p>
              The app does not knowingly collect any personal information from anyone, including children.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an
              updated "last updated" date.
            </p>
          </section>

          <section>
            <h2 class="text-white font-bold text-base mb-2">Contact</h2>
            <p>
              Questions about this policy can be sent to
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
