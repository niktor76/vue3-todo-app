<template>
  <Teleport to="body">
    <div v-if="isVisible">
      <div class="backdrop">
        <div class="modal">
          <button class="close" @click="emit('hide-modal')">Close</button>
          <div>
            <h2>File Operations</h2>
            <button class="export" @click="emit('export-tasks')">Export Tasks</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  isVisible: Boolean,
})
const emit = defineEmits(['export-tasks', 'hide-modal'])

watch(
  () => props.isVisible,
  (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
  },
)
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
