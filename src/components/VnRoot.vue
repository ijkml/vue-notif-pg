<script lang="ts" setup>
import { useNotifications } from '@/composables/notifications';
// import { ref, watch } from 'vue';
import VnItem from './VnItem.vue';

const { notifications, remove } = useNotifications();

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
        <div
          v-for="notif of notifications"
          :key="notif.id"
          class="notif-cont-child"
        >
          <VnItem
            v-bind.prop="notif"
            :stacked="true"
            @close="close(notif.id)"
          />
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
    @apply px-4 py-6 overflow-y-auto relative
      sm:px-6 lg:px-8 transition overflow-hidden;
  }
}

.notif-cont-child {
  @apply gap-y-3 p-2px;
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

@keyframes snackbar-hide {
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>
