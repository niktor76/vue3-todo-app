<template>
  <div class="">
    <h1>Todo App</h1>
    <div>Create a new task</div>
    <input type="text" v-model="newTaskText" @keyup.enter="addTask" placeholder="Add a new task" />
    <button @click="addTask">+</button>

    <div>Tasks</div>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input type="checkbox" name="done" v-model="task.done" />
        <span :class="{ done: task.done }">{{ task.text }}</span>
        <button @click="removeTask(task.id)">X</button>
      </li>
    </ul>
    <button v-if="tasks.some((task) => task.done)" @click="clearCompleted()">
      Clear completed tasks
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const tasks = ref([])
const newTaskText = ref('')

const addTask = () => {
  const trimmedText = newTaskText.value.trim()
  if (!trimmedText) return
  tasks.value.push({ id: Date.now(), text: trimmedText, done: false })
  newTaskText.value = ''
}

const removeTask = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

const clearCompleted = () => {
  tasks.value = tasks.value.filter((task) => !task.done)
}

// Save tasks in LocalStorage on changes
watch(
  tasks,
  (newTasks) => {
    localStorage.setItem('todos', JSON.stringify(newTasks))
  },
  { deep: true },
)

onMounted(() => {
  try {
    const savedTodos = JSON.parse(localStorage.getItem('todos'))
    if (Array.isArray(savedTodos)) {
      tasks.value = savedTodos
    }
  } catch (err) {
    console.error('Error thrown: ', err)
  }
})
</script>

<style lang="scss">
.done {
  text-decoration: line-through;
}
</style>
