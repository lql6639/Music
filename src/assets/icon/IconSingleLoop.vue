<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline
      points="17 1 21 5 17 9"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3 11V9a4 4 0 0 1 4-4h14"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
    />
    <line
      x1="12"
      y1="15"
      x2="12"
      y2="19"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <text x="12" y="22" text-anchor="middle" font-size="8" fill="currentColor">1</text>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string; className?: string }>(), { size: '1em' })
</script>
