<template>
  <div>
    <label for="darkmode-switch">Dark mode</label>
    <input v-model="darkMode" type="checkbox" name="darkmode" id="darkmode-switch" />
    <h1>Todo App</h1>
    <TaskInput v-model="newTaskText" @add-task="addTask" />

    <div aria-labelledby="filter-heading">
      <h2 id="filter-heading">Task filter</h2>
      <button :class="{ 'is-selected': filterState === 'all' }" @click="filterState = 'all'">
        All ({{ tasks.length }})
      </button>
      <button :class="{ 'is-selected': filterState === 'active' }" @click="filterState = 'active'">
        Active ({{ tasks.filter((task) => !task.done).length }})
      </button>
      <button
        :class="{ 'is-selected': filterState === 'completed' }"
        @click="filterState = 'completed'"
      >
        Completed ({{ tasks.filter((task) => task.done).length }})
      </button>
    </div>

    <section aria-labelledby="task-list-heading">
      <h2 id="task-list-heading">Task List</h2>
      <ul>
        <li v-for="task in filteredTasks" :key="task.id">
          <TaskItem
            :task="task"
            @done="done"
            @update-text="updateText"
            @remove-task="removeTask"
            @edit-start="startEditingTaskLabel"
            @edit-stop="stopEditingTaskLabel"
          />
        </li>
      </ul>
    </section>
    <button v-if="tasks.some((task) => task.done)" @click="clearCompleted()">
      Clear completed tasks
    </button>
  </div>
  <div>
    <h2>File Operations</h2>
    <button class="export" @click="exportTasks()">Export Tasks</button>
  </div>
  <div class="sr-only" aria-live="polite">{{ announcement }}</div>
</template>

<script setup>
// TODO: Styling
// TODO: Drag and Drop
// TODO: Due dates/reminders
// TODO: Complete accessibility features

import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TaskItem from './components/TaskItem.vue'
import TaskInput from './components/TaskInput.vue'
import Card from './components/Card.vue'

const titleAttrName = ref('title')

const tasks = ref([])
const newTaskText = ref('')
const darkMode = ref()
const filterState = ref('all')
const announcement = ref()

// Make dark mode changes persistent in localStorage
watch(darkMode, (darkMode) => {
  localStorage.setItem('darkMode', darkMode ? 'true' : 'false')
  document.body.classList.toggle('dark-mode', darkMode)
})

// Filter logic
const filteredTasks = computed(() => {
  if (filterState.value === 'active') {
    announcement.value = 'List filtered, showing only active tasks.'
    return tasks.value.filter((task) => !task.done)
  } else if (filterState.value === 'completed') {
    announcement.value = 'List filtered, showing only completed tasks.'
    return tasks.value.filter((task) => task.done)
  } else if (filterState.value === 'all') {
    announcement.value = 'List filtered, showing all tasks.'
    return tasks.value
  }
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
  announcement.value = `Task ${trimmedText} added.`
}

// Remove all done tasks from the list
const clearCompleted = () => {
  tasks.value = tasks.value.filter((task) => !task.done)
  announcement.value = 'Completed tasks removed.'
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

const startEditingTaskLabel = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId)
  task.isEditing = true
}

const stopEditingTaskLabel = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId)
  task.isEditing = false
}

const removeTask = (id) => {
  announcement.value = `Task ${tasks.value.find((t) => t.id)?.text} deleted.`
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

// File Operations
const exportTasks = () => {
  const stringifiedTasks = JSON.stringify(tasks.value, null, 2)

  // Create a Blob object
  const blob = new Blob([stringifiedTasks], { type: 'application/json' })

  // Create a download URL
  const url = URL.createObjectURL(blob)

  // Create hidden a element
  const aElm = document.createElement('a')
  aElm.href = url
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-')
  aElm.download = `tasks_${timestamp}.json`
  aElm.click()
  URL.revokeObjectURL(url)
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
    padding: 5px;
    margin: 2px;
  }
  input {
    background-color: #b8f0b0;
  }

  .is-selected {
    color: white;
    background-color: blue;
  }
}
</style>
