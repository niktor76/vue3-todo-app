<template>
  <div>
    <label for="darkmode-switch">Dark mode</label>
    <input v-model="darkMode" type="checkbox" name="darkmode" id="darkmode-switch" />
    <h1>Todo App</h1>
    <div>Create a new task</div>
    <input type="text" v-model="newTaskText" @keyup.enter="addTask" placeholder="Add a new task" />
    <button @click="addTask">+</button>

    <div>Tasks</div>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input type="checkbox" name="done" v-model="task.done" />
        <span v-if="!task.isEditing" :class="{ done: task.done }" @click="task.isEditing = true">{{
          task.text
        }}</span>
        <input
          v-else
          @keyup.enter="updateText(task, $event)"
          @blur="task.isEditing = false"
          type="text"
          name="editing-text"
          :value="task.text"
          :ref="
            (el) => {
              if (el) el.focus()
            }
          "
        />

        <button @click="removeTask(task.id)">X</button>
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

const removeTask = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

// Remove all done tasks from the list
const clearCompleted = () => {
  tasks.value = tasks.value.filter((task) => !task.done)
}

const updateText = (task, evt) => {
  task.text = evt.target.value
  task.isEditing = false
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
