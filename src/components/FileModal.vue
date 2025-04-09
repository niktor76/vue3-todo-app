<template>
  <div class="">
    <div>
      <h2>File Operations</h2>
      <button class="export" @click="emit('exportTasks')">Export Tasks</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps()
const emit = defineEmits(['exportTasks'])
</script>

<style lang="scss"></style>
