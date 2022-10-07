<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { IconProps } from '@/types';

const props = withDefaults(defineProps<IconProps>(), {
  icon: '',
  size: '24px',
  vbox: '0 0 24 24',
});

const { icon, size: rawSize, vbox } = toRefs(props);

const size = computed(() =>
  Number.isNaN(Number(rawSize.value)) ? rawSize.value : `${rawSize.value}px`
);
</script>

<template>
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="vbox"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      width="24px"
      aria-hidden="true"
    >
      <path :d="icon" />
    </svg>
  </span>
</template>

<style scoped lang="less">
span {
  width: v-bind(size);
  height: v-bind(size);
  @apply text-inherit inline-flex items-center
    justify-center leading-inherit;

  > svg {
    fill: currentColor;
    width: v-bind(size);
    height: v-bind(size);
    max-width: 100px;
  }
}
</style>
