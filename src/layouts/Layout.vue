<template>
  <div class="layout">
    <header>
      <h1>Todo App</h1>
    </header>
    <main>
      <slot />
    </main>
    <footer>&copy; 2025</footer>
    <BaseToast />
  </div>
</template>

<script setup>
// Components
import BaseToast from '@/components/BaseToast.vue'

const props = defineProps()
</script>

<style lang="scss">
.layout {
  min-height: 100vw;
  display: flex;
  flex-direction: column;
}

header {
  padding: 15px;
  h1 {
    margin: 0px;
  }
}

main {
  flex: 1;
  margin: 15px;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100vw;
  background-color: inherit;
  padding: 15px;
  text-align: center;
}

header,
footer {
  background-color: var(--color-surface);
  // background-color: color-mix(in oklch, var(--color-surface) 100%, white 20%);
}
</style>
