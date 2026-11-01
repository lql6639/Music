<template>
  <svg
    :width="size"
    :height="size"
    :class="className"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.3" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string; className?: string }>(), { size: 12 })
</script>
