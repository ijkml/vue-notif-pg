<script setup lang="ts">
import {
  alertClose,
  alertError,
  alertInfo,
  alertSuccess,
  alertWarning,
} from '@/assets/icons';

import {
  type UseTickerReturnType,
  type UseTimerReturnType,
  useTicker,
  useTimer,
} from '@/composables/timer';

import { isValidTimeout } from '@/composables/helpers';

import { toRefs, computed, ref, onBeforeUnmount, onMounted } from 'vue';

import type { VnNotificationOptions as Props } from '@/types/basic';
import VnIcon from './VnIcon.vue';

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  timeout: 0,
  dark: false,
  callback: () => {},
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { timeout: userTimeout, type, callback, dark: isDark } = toRefs(props);

const timer = ref<UseTimerReturnType | null>(null);
const ticker = ref<UseTickerReturnType | null>(null);
const timeout = computed(() => {
  return isValidTimeout(userTimeout.value) ? userTimeout.value : 0;
});
const remainingTime = ref(timeout.value);

const iconName = computed(() => {
  return {
    warning: alertWarning,
    info: alertInfo,
    success: alertSuccess,
    error: alertError,
  }[type.value];
});

const iconColorClass = computed(() => {
  return `alert-icon-${type.value}`;
});

const progressBarColorClass = computed(() => {
  return (
    {
      warning: 'bg-orange-400',
      info: 'bg-blue-400',
      success: 'bg-green-400',
      error: 'bg-red-400',
    }[type.value] || 'bg-gray-400'
  );
});

const progressBarStyle = computed(() => {
  const remainingPercent = (remainingTime.value / timeout.value) * 100;
  return { width: `${remainingPercent}%` };
});

function close() {
  callback.value();
  emit('close');
}

function onMouseover() {
  if (timer.value) {
    timer.value.pause();
    ticker.value?.stop();
  }
}

function onMouseout() {
  if (timer.value) {
    timer.value.resume();
    ticker.value?.start();
  }
}

onMounted(() => {
  timer.value = useTimer(() => {
    timeout.value && close();
  }, timeout.value);
  ticker.value = useTicker(() => {
    remainingTime.value -= 10;
  }, 10);
});

onBeforeUnmount(() => {
  if (timer.value) {
    timer.value.stop();
    ticker.value?.stop();
  }
});
</script>

<template>
  <div
    class="notification-container"
    :class="
      isDark
        ? 'ring-skye-dark bg-skye-darkest'
        : 'ring-gray-200 dark:ring-skye-dark bg-white dark:bg-skye-darkest'
    "
    @mouseover="onMouseover"
    @mouseout="onMouseout"
  >
    <div class="p-4 flex">
      <VnIcon v-bind="iconName" size="24px" :class="`${iconColorClass}`" />
      <div class="ml-3 flex-1 pt-0.5">
        <p
          class="text-sm font-medium leading-5"
          :class="isDark ? 'text-white' : 'text-skye-black dark:text-white'"
        >
          {{ title }}
        </p>
        <p
          v-if="description"
          class="mt-1 text-sm leading-5"
          :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'"
        >
          {{ description }}
        </p>
      </div>
      <button
        class="ml-4 self-start focus:outline-none hover:text-gray-500 focus:text-gray-500"
        :class="isDark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'"
        title="Close"
        @click.stop="close"
      >
        <VnIcon label="Close" v-bind="alertClose" size="20px" />
      </button>
    </div>
    <div v-if="timeout" class="absolute bottom-0 left-0 right-0">
      <div
        class="h-1"
        :class="progressBarColorClass"
        :style="progressBarStyle"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.notification-container {
  @apply transition z-50 w-full relative overflow-hidden
    pointer-events-auto shadow-lg rounded-lg ring-1;
}

.alert-icon {
  &-warning {
    @apply text-orange-400;
  }
  &-info {
    @apply text-blue-400;
  }
  &-success {
    @apply text-green-400;
  }
  &-error {
    @apply text-red-400;
  }
}
</style>
