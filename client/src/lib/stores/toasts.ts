import type Toast from '$lib/interfaces/toast'
import { writable } from 'svelte/store'

export const toasts = writable<Toast[]>([])

export const dismissToast = (id: Number) => {
  toasts.update((all) => all.filter((t: any) => t.id !== id))
}

export const addToast = (toast: any) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = Math.floor(Math.random() * 10000)

  // Setup some sensible defaults for a toast.
  const defaults: Toast = {
    id,
    type: 'info',
    dismissible: false,
    timeout: 3000,
    message: '',
  }

  // Push the toast to the top of the list of toasts
  const t = { ...defaults, ...toast }
  toasts.update((all) => [t, ...all])

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (t.timeout) setTimeout(() => dismissToast(id), t.timeout)
}