<script setup lang="ts">
import { useNotifications } from '@/composables/notifications';
import { ref } from 'vue';
defineProps<{
  msg: string;
}>();

const { add, destroy } = useNotifications();
const n = ref(8);

function id() {
  n.value += 3;
  return n.value;
}

const dummy =
  'So the LORD God said, It is not good. So the LORD God said, It is not good.';

function sendNotif() {
  add({
    title: `Test ${id()}`,
    type: 'success',
    description: n.value % 2 === 0 ? dummy : dummy + dummy,
    dark: true,
    // timeout: 10_000,
  });
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <span>Vite</span> + <span>Vue 3</span>
    </h3>
    <button
      class="green border border-zinc-700 px-5 py-2 rounded-lg m-5"
      @click="sendNotif"
    >
      Send Notif
    </button>
    <button
      class="green border border-zinc-700 px-5 py-2 rounded-lg m-5"
      @click="destroy"
    >
      Destroy All
    </button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
