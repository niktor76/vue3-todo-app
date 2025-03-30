<template>
  <div class="">
    <label for="add-task-input">Create a new task: </label>
    <input
      id="add-task-input"
      type="text"
      v-model="newTaskText"
      @keyup.enter="emit('add-task')"
      placeholder="Add a new task"
    />
    <button @click="emit('add-task')" aria-label="Add new task">Add</button>
  </div>
</template>

<script setup>
const newTaskText = defineModel()
const emit = defineEmits('add-task')
</script>

<style lang="scss"></style>
