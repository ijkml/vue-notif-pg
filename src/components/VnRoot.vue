<script lang="ts" setup>
import { useNotifications } from '@/composables/notifications';
// import { ref, watch } from 'vue';
import VnItem from './VnItem.vue';

const { notifications, remove } = useNotifications();
</script>

<template>
  <div class="notif-cont">
    <div>
      <TransitionGroup appear name="vn-slide-fade-13">
        <div v-for="notif of notifications" :key="notif.id">
          <VnItem v-bind.prop="notif" @close="remove(notif.id)" />
        </div>
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
      sm:px-6 lg:px-8 overflow-hidden;

    > div {
      @apply gap-y-3 p-2px;
    }
  }
}
</style>
<style lang="less">
@keyframes snackbar-hide {
  to {
    opacity: 0;
    transform: translate(100%, 50%);
  }
}

@keyframes snackbar-show {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}

.vn-slide-fade-13 {
  &-enter-active {
    animation: snackbar-show 300ms ease 1;
  }
  &-leave-active {
    animation: snackbar-hide 300ms ease forwards 1;
    position: absolute;
    bottom: 0;
  }
}
</style>
