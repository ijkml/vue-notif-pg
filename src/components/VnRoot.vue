<script lang="ts" setup>
import { useNotifications } from '@/composables/notifications';
import VnItem from './VnItem.vue';

const { notifications, remove } = useNotifications();

// const notifications = computed(() => {
//   return allNotifications.value.slice().reverse();
// });

function close(id: string) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.style.visibility = 'hidden';
  }
  remove(id);
}
</script>

<template>
  <div class="notif-cont">
    <div>
      <TransitionGroup tag="div" name="vn-slide-fade-13">
        <VnItem
          v-for="notif of notifications"
          :key="notif.id"
          v-bind="notif"
          @close="close(notif.id)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="less" scoped>
.notif-cont {
  @apply fixed bottom-0 right-0 flex flex-col
    justify-end w-full z-50 sm:w-96;

  > div {
    @apply px-4 py-6 overflow-y-auto
      sm:px-6 lg:px-8 transition overflow-hidden;

    > div {
      @apply space-y-3;
    }
  }
}
</style>
<style lang="less">
.vn-slide-fade-13 {
  &-enter-active {
    transition: all 300ms ease-out;
  }

  &leave-active {
    transition: all 450ms cubic-bezier(1, 0.5, 0.8, 1);
  }

  &-enter-from,
  &-leave-to {
    transform: translateY(36px);
    opacity: 0;
  }
}
</style>
