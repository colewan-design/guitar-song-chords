<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Snackbar -->
    <Transition name="snack">
      <div
        v-if="snackMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold pointer-events-none"
        :class="snackType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        <svg v-if="snackType === 'success'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
        <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
        </svg>
        {{ snackMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { message: snackMessage, type: snackType } = useSnackbar()
</script>

<style scoped>
.snack-enter-active, .snack-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translate(-50%, 12px); }
</style>
