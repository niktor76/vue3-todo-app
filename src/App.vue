<template>
  <div>
    <label for="darkmode-switch">Dark mode</label>
    <input v-model="darkMode" type="checkbox" name="darkmode" id="darkmode-switch" />
    <h1>Todo App</h1>
    <TaskInput v-model="newTaskText" @add-task="addTask" />

    <div>Tasks</div>
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
    <button v-if="tasks.some((task) => task.done)" @click="clearCompleted()">
      Clear completed tasks
    </button>
  </div>
</template>

<script setup>
// TODO: Styling
// TODO: Task filtering
// TODO: Testing (Vitest)
// TODO: Import/Export as JSON
// TODO: Drag and Drop
// TODO: Due dates/reminders

import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TaskItem from './TaskItem.vue'
import TaskInput from './TaskInput.vue'

const tasks = ref([])
const newTaskText = ref('')
const darkMode = ref()
const filterState = ref('all')

// Make dark mode changes persistent in localStorage
watch(darkMode, (darkMode) => {
  localStorage.setItem('darkMode', darkMode ? 'true' : 'false')
  document.body.classList.toggle('dark-mode', darkMode)
})

// Filter logic
const filteredTasks = computed(() => {
  if (filterState.value === 'active') {
    return tasks.value.filter((task) => !task.done)
  } else if (filterState.value === 'completed') {
    return tasks.value.filter((task) => task.done)
  } else if (filterState.value === 'all') {
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

const startEditingTaskLabel = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId)
  task.isEditing = true
}

const stopEditingTaskLabel = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId)
  task.isEditing = false
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
