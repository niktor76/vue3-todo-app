<template>
  <Teleport to="body">
    <div class="backdrop" @click.self="emit('hide-modal')">
      <div class="modal">
        <button class="close" @click="emit('hide-modal')">Close</button>
        <div>
          <h2>File Operations</h2>
          <button class="import" @click="importTasksInput?.click()">Import Tasks</button>
          <input
            v-show="false"
            ref="import-tasks-input"
            type="file"
            id="importTasks"
            accept=".json"
            @change="emit('import-tasks', $event)"
          />
          <button class="export" @click="emit('export-tasks')">Export Tasks</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch, useTemplateRef } from 'vue'

const props = defineProps({
  isVisible: Boolean,
})
const emit = defineEmits(['export-tasks', 'import-tasks', 'hide-modal'])

const importTasksInput = useTemplateRef('import-tasks-input')

watch(
  () => props.isVisible,
  (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
  },
)

// Close modal on Escape key
function closeModal(evt) {
  if (evt.key === 'Escape') {
    emit('hide-modal')
  }
}

onMounted(() => {
  window.addEventListener('keyup', closeModal)
})

onUnmounted(() => {
  window.removeEventListener('keyup', closeModal)
})
</script>

<style lang="scss">
.backdrop {
  background-color: rgba(0, 0, 0, 0.3); // semi-transparent black
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(10px);
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.container {
  position: fixed;
  z-index: 1001;
}
</style>
