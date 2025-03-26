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
      :class="{ done: task.done }"
      @click="emit('edit-start', task.id)"
      >{{ task.text }}</span
    >
    <input
      v-else
      @keyup.enter="emit('update-text', task.id, $event.target.value)"
      @blur="emit('edit-stop', task.id)"
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
const props = defineProps({
  task: Object,
})

const emit = defineEmits(['done', 'update-text', 'edit-start', 'edit-stop', 'remove-task'])
</script>

<style lang="scss"></style>
