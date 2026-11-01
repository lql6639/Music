<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2" fill="none" />
    <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none" />
    <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2" fill="none" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string; className?: string }>(), { size: '1em' })
</script>
