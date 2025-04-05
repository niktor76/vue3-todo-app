<template>
  <div class="app-container">
    <!-- Removed dark mode toggle -->
    <h1>Todo App</h1>
    <TaskInput v-model="newTaskText" @add-task="addTask" />

    <div class="filter-controls" aria-labelledby="filter-heading">
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

    <section class="task-list-section" aria-labelledby="task-list-heading">
      <h2 id="task-list-heading">Task List</h2>
      <ul class="task-list">
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
    <button
      class="clear-completed-button"
      v-if="tasks.some((task) => task.done)"
      @click="clearCompleted()"
    >
      Clear completed tasks
    </button>
  </div>
  <div class="file-operations">
    <h2>File Operations</h2>
    <button class="export-button" @click="exportTasks()">Export Tasks</button>
  </div>
  <div class="sr-only" aria-live="polite">{{ announcement }}</div>
</template>

<script setup>
// TODO: Styling
// TODO: Drag and Drop
// TODO: Due dates/reminders
// TODO: Complete accessibility features

import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TaskItem from './TaskItem.vue'
import TaskInput from './TaskInput.vue'

const tasks = ref([])
const newTaskText = ref('')
// Removed darkMode ref
const filterState = ref('all')
const announcement = ref()

// Removed darkMode watcher

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

    // Removed darkMode initialization
  } catch (err) {
    console.error('Error thrown: ', err)
  }
})
</script>

<style scoped>
.app-container {
  max-width: 700px; /* Slightly wider */
  margin: 2rem auto;
  padding: calc(var(--spacing-unit) * 1.5);
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius); /* Sharp edges */
  box-shadow: var(--glow-intensity-box) rgba(0, 255, 255, 0.4); /* Cyan glow */
}

h1 {
  text-align: center;
  margin-bottom: calc(var(--spacing-unit) * 1.5);
  color: var(--color-primary-glow);
  text-transform: uppercase; /* Common cyberpunk style */
  letter-spacing: 2px;
  text-shadow:
    var(--glow-intensity-text) var(--color-primary-glow),
    0 0 15px rgba(0, 255, 255, 0.5); /* Stronger glow */
  animation: flicker 3s infinite alternate; /* Add flicker animation */
}

/* Flicker Animation */
@keyframes flicker {
  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    text-shadow:
      0 0 4px var(--color-primary-glow),
      0 0 10px var(--color-primary-glow),
      0 0 18px var(--color-primary-glow);
    opacity: 1;
  }
  20%,
  24%,
  55% {
    text-shadow: none;
    opacity: 0.8;
  }
}

.filter-controls,
.task-list-section,
.file-operations {
  margin-top: calc(var(--spacing-unit) * 2);
}

.filter-controls h2,
.task-list-section h2,
.file-operations h2 {
  margin-bottom: var(--spacing-unit);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: calc(var(--spacing-unit) * 0.5);
  color: var(--color-secondary-glow); /* Magenta */
  text-shadow: var(--glow-intensity-text) var(--color-secondary-glow);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filter-controls button {
  /* Inherit base button styles */
  margin-right: calc(var(--spacing-unit) * 0.5);
  border-color: var(--color-secondary-glow);
  color: var(--color-secondary-glow);
  text-shadow: var(--glow-intensity-text) var(--color-secondary-glow);
  box-shadow:
    inset 0 0 5px rgba(255, 0, 255, 0.2),
    var(--glow-intensity-box) rgba(255, 0, 255, 0.3);
}

.filter-controls button:hover,
.filter-controls button:focus {
  background-color: rgba(255, 0, 255, 0.1);
  color: white;
  text-shadow:
    var(--glow-intensity-text) white,
    var(--glow-intensity-text) var(--color-secondary-glow);
  box-shadow:
    inset 0 0 10px rgba(255, 0, 255, 0.4),
    var(--glow-intensity-box) rgba(255, 0, 255, 0.6);
}

.filter-controls button.is-selected {
  /* Use primary color for selected */
  border-color: var(--color-primary-glow);
  color: var(--color-primary-glow);
  text-shadow: var(--glow-intensity-text) var(--color-primary-glow);
  box-shadow:
    inset 0 0 8px rgba(0, 255, 255, 0.4),
    var(--glow-intensity-box) rgba(0, 255, 255, 0.5);
  background-color: rgba(0, 255, 255, 0.1);
  font-weight: normal; /* Remove bold */
}

.task-list {
  list-style: none;
  padding: 0;
  margin-top: var(--spacing-unit);
}

.task-list li {
  margin-bottom: calc(var(--spacing-unit) * 0.75); /* Slightly more spacing */
}

.clear-completed-button,
.export-button {
  /* Use secondary color */
  display: inline-block; /* Allow side-by-side */
  margin-top: var(--spacing-unit);
  margin-right: var(--spacing-unit); /* Add space between buttons */
  border-color: var(--color-secondary-glow);
  color: var(--color-secondary-glow);
  text-shadow: var(--glow-intensity-text) var(--color-secondary-glow);
  box-shadow:
    inset 0 0 5px rgba(255, 0, 255, 0.2),
    var(--glow-intensity-box) rgba(255, 0, 255, 0.3);
}

.clear-completed-button:hover,
.clear-completed-button:focus,
.export-button:hover,
.export-button:focus {
  background-color: rgba(255, 0, 255, 0.1);
  color: white;
  text-shadow:
    var(--glow-intensity-text) white,
    var(--glow-intensity-text) var(--color-secondary-glow);
  box-shadow:
    inset 0 0 10px rgba(255, 0, 255, 0.4),
    var(--glow-intensity-box) rgba(255, 0, 255, 0.6);
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

/* Removed all previous :global(body.dark-mode) styles */
</style>
