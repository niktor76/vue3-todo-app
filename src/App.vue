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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const tasks = ref([])
const newTaskText = ref('')

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
    const savedTodos = JSON.parse(localStorage.getItem('todos'))
    if (Array.isArray(savedTodos)) {
      // Set all isEditing values to false
      savedTodos.forEach((todo) => (todo.isEditing = false))
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
