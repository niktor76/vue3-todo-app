<template>
  <div class="">
    <div>Create a new task</div>
    <input
      type="text"
      v-model="newTaskText"
      @keyup.enter="emit('add-task')"
      placeholder="Add a new task"
    />
    <button @click="emit('add-task')">+</button>
  </div>
</template>

<script setup>
const newTaskText = defineModel()
const emit = defineEmits('add-task')
</script>

<style lang="scss"></style>
