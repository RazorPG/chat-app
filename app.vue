<template>
  <NuxtPage />
</template>

<script setup>
  // Import Leaflet CSS
  if (process.client) {
    import('leaflet/dist/leaflet.css')
  }
</script>

<style>
  /* global styles can go here */
</style>
