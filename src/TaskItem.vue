<template>
  <div class="task-item" :class="{ done: task.done }">
    <input
      class="task-checkbox"
      type="checkbox"
      name="done"
      @change="emit('done', task.id, !task.done)"
      :checked="task.done"
      :aria-label="`Mark ${task.text} as ${task.done ? 'not done' : 'done'}`"
    />
    <span
      v-if="!task.isEditing"
      ref="task-text"
      class="task-text-display"
      @click="emit('edit-start', task.id)"
      @keyup.enter="emit('edit-start', task.id)"
      @keyup.space="emit('edit-start', task.id)"
      tabindex="0"
      role="button"
      :aria-label="`Edit text of task ${task.text}`"
      >{{ task.text }}</span
    >
    <input
      v-else
      class="task-text-edit"
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
    <button
      class="delete-button"
      @click="emit('remove-task', task.id)"
      :aria-label="`Delete task ${task.text}`"
    >
      Delete
    </button>
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

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit) * 0.75); /* Slightly more gap */
  padding: calc(var(--spacing-unit) * 0.75);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius); /* Sharp edges */
  background-color: transparent; /* Let card background show through */
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  position: relative; /* For potential pseudo-elements later */
}

.task-item:hover {
  background-color: rgba(0, 255, 255, 0.05); /* Subtle cyan hover */
  border-color: var(--color-primary-glow);
  box-shadow: var(--glow-intensity-box) rgba(0, 255, 255, 0.3);
}

.task-checkbox {
  /* Custom Checkbox Styles */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1.2em;
  height: 1.2em;
  border: 1px solid var(--color-secondary-glow); /* Magenta border */
  border-radius: var(--border-radius);
  background-color: transparent;
  cursor: pointer;
  position: relative;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  flex-shrink: 0;
  box-shadow: var(--glow-intensity-box) rgba(255, 0, 255, 0.2);
}

.task-checkbox:checked {
  background-color: var(--color-accent-glow); /* Neon lime when checked */
  border-color: var(--color-accent-glow);
  box-shadow: var(--glow-intensity-box) rgba(57, 255, 20, 0.5); /* Lime glow */
}

.task-checkbox:hover {
  border-color: var(--color-primary-glow); /* Cyan hover */
  box-shadow: var(--glow-intensity-box) rgba(0, 255, 255, 0.4);
}

.task-text-display,
.task-text-edit {
  flex-grow: 1;
  word-break: break-all;
  color: var(--color-text); /* Inherit base text color */
  text-shadow: var(--glow-intensity-text) rgba(224, 224, 224, 0.3); /* Inherit base glow */
}

.task-text-display {
  cursor: pointer;
  padding: calc(var(--spacing-unit) * 0.25) 0;
  transition:
    color 0.2s ease,
    text-shadow 0.2s ease;
}

.task-text-display:hover {
  color: var(--color-primary-glow);
  text-shadow: var(--glow-intensity-text) var(--color-primary-glow);
}

.task-text-edit {
  /* Inherit base input styles from base.css */
  padding: calc(var(--spacing-unit) * 0.25);
  background-color: rgba(0, 0, 0, 0.5); /* Darker background for editing */
  border-color: var(--color-secondary-glow); /* Magenta border */
}

.task-text-edit:focus {
  border-color: var(--color-primary-glow); /* Cyan focus */
  box-shadow: var(--glow-intensity-box) rgba(0, 255, 255, 0.5);
}

.task-item.done .task-text-display {
  text-decoration: line-through;
  text-decoration-color: var(--color-accent-glow); /* Lime strikethrough */
  color: rgba(224, 224, 224, 0.5); /* Dimmed text */
  text-shadow: none; /* Remove glow on done text */
  cursor: default;
}

.delete-button {
  /* Inherit base button styles */
  flex-shrink: 0;
  padding: calc(var(--spacing-unit) * 0.25);
  border: 1px solid var(--color-secondary-glow); /* Magenta */
  color: var(--color-secondary-glow);
  text-shadow: var(--glow-intensity-text) var(--color-secondary-glow);
  box-shadow:
    inset 0 0 5px rgba(255, 0, 255, 0.2),
    var(--glow-intensity-box) rgba(255, 0, 255, 0.3);
  opacity: 0.7; /* Slightly faded */
}

.delete-button:hover,
.delete-button:focus {
  opacity: 1;
  background-color: rgba(255, 0, 255, 0.1);
  color: white;
  text-shadow:
    var(--glow-intensity-text) white,
    var(--glow-intensity-text) var(--color-secondary-glow);
  box-shadow:
    inset 0 0 10px rgba(255, 0, 255, 0.4),
    var(--glow-intensity-box) rgba(255, 0, 255, 0.6);
}

/* Cyberpunk Focus Handling */
:focus-visible {
  outline: none; /* Remove default outline */
  border-color: var(--color-primary-glow) !important; /* Force cyan border */
  box-shadow:
    var(--glow-intensity-box) var(--color-primary-glow),
    inset 0 0 8px rgba(0, 255, 255, 0.4) !important; /* Force cyan glow */
}

/* Remove previous :global styles */
</style>
