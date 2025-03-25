<template>
  <div>
    <label for="darkmode-switch">Dark mode</label>
    <input v-model="darkMode" type="checkbox" name="darkmode" id="darkmode-switch" />
    <h1>Todo App</h1>
    <TaskInput v-model="newTaskText" @add-task="addTask" />

    <div>Tasks</div>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <TaskItem
          :task="task"
          @done="done"
          @update-text="updateText"
          @remove-task="removeTask"
          @is-editing="toggleEditing"
        />
      </li>
    </ul>
    <button v-if="tasks.some((task) => task.done)" @click="clearCompleted()">
      Clear completed tasks
    </button>
    <div>Tasks count: {{ tasks.length }}</div>
    <div>Tasks completed: {{ tasks.filter((task) => task.done).length }}</div>
    <div>Tasks left to do: {{ tasks.filter((task) => !task.done).length }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import TaskItem from './TaskItem.vue'
import TaskInput from './TaskInput.vue'

const tasks = ref([])
const newTaskText = ref('')
const darkMode = ref()

// Make dark mode changes persistent in localStorage
watch(darkMode, (darkMode) => {
  localStorage.setItem('darkMode', darkMode ? 'true' : 'false')
  document.body.classList.toggle('dark-mode', darkMode)
})

const addTask = () => {
  const trimmedText = newTaskText.value.trim()
  if (!trimmedText) return

  tasks.value.push({
    id: Date.now(),
    text: trimmedText,
    done: false,
    isEditing: false,
  })
  newTaskText.value = ''
}

// Remove all done tasks from the list
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

const done = (taskId, done) => {
  tasks.value.find((task) => task.id === taskId).done = done
}

const updateText = (taskId, newText) => {
  const task = tasks.value.find((task) => task.id === taskId)
  task.text = newText
  task.isEditing = false
}

const toggleEditing = (taskId, isEditing) => {
  const task = tasks.value.find((task) => task.id === taskId)
  task.isEditing = isEditing
}

const removeTask = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

onMounted(() => {
  try {
    // Get saved todos from localStorage
    const savedTodos = JSON.parse(localStorage.getItem('todos'))
    if (Array.isArray(savedTodos)) {
      // Set all isEditing values to false
      savedTodos.forEach((todo) => (todo.isEditing = false))
      tasks.value = savedTodos
    }

    // Init dark mode base on settings in the localStorage
    darkMode.value = localStorage.getItem('darkMode') === 'true'
  } catch (err) {
    console.error('Error thrown: ', err)
  }
})
</script>

<style lang="scss">
* {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.done {
  text-decoration: line-through;
}

.dark-mode {
  color: rgb(213, 194, 158);
  background-color: rgb(31, 65, 65);

  button {
    background-color: #cee645;
  }
  input {
    background-color: #b8f0b0;
  }
}
</style>
