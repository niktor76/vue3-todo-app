<template>
  <div class="">
    <input
      type="checkbox"
      name="done"
      @change="emit('done', task.id, !task.done)"
      :checked="task.done"
    />
    <span
      v-if="!task.isEditing"
      ref="task-text"
      :class="{ done: task.done }"
      @click="emit('edit-start', task.id)"
      @keyup.enter="emit('edit-start', task.id)"
      @keyup.space="emit('edit-start', task.id)"
      tabindex="0"
      role="button"
      aria-label="Edit task"
      >{{ task.text }}</span
    >
    <input
      v-else
      @keyup.enter="emit('update-text', task.id, $event.target.value)"
      @blur="emit('edit-stop', task.id)"
      @keyup.escape="emit('edit-stop', task.id)"
      type="text"
      name="editing-text"
      :value="task.text"
      :ref="
        (el) => {
          if (el) el.focus()
        }
      "
    />
    <button @click="emit('remove-task', task.id)">X</button>
  </div>
</template>

<script setup>
import { nextTick, useTemplateRef, watch } from 'vue'

const props = defineProps({
  task: Object,
})

const emit = defineEmits(['done', 'update-text', 'edit-start', 'edit-stop', 'remove-task'])
const taskText = useTemplateRef('task-text')
watch(
  () => props.task.isEditing,
  async (isEditingNow, previousIsEditingState) => {
    if (previousIsEditingState && !isEditingNow) {
      await nextTick()
      taskText.value?.focus()
    }
  },
)
</script>

<style lang="scss">
:focus {
  outline: 2px dashed #cf19c6;
  outline-offset: 2px;
}
</style>
