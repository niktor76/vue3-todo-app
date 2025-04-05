<template>
  <div class="task-input-container">
    <label for="add-task-input" class="sr-only">Create a new task: </label>
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

<style scoped>
.task-input-container {
  display: flex;
  gap: calc(var(--spacing-unit) * 0.5);
  margin-bottom: calc(var(--spacing-unit) * 1.5); /* Add slightly more margin */
}

/* Input and button will inherit base styles from base.css */
input[type='text'] {
  flex-grow: 1;
  /* Base styles apply automatically */
}

button {
  flex-shrink: 0;
  /* Base styles apply automatically */
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
