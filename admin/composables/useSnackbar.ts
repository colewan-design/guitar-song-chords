const message = ref('')
const type = ref<'success' | 'error'>('success')
let timer: ReturnType<typeof setTimeout> | null = null

export function useSnackbar() {
  function show(msg: string, kind: 'success' | 'error' = 'success', duration = 3000) {
    if (timer) clearTimeout(timer)
    message.value = msg
    type.value = kind
    timer = setTimeout(() => { message.value = '' }, duration)
  }

  return { message, type, show }
}
