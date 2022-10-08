import type { VnNotificationOptions, NotificationId } from '@/types';
import { genId, isBusy, mainQ, tempQ } from './store';
import { removeLast, mergeToMain, stack, adjustDeck } from './helpers';
import { watch } from 'vue';

/**
 * remove all notifications
 */
function destroy(): void {
  // recursively (and smoothly) remove the last item every 160ms
  setTimeout(function popNext() {
    isBusy.value = true;
    const done = removeLast();

    if (!done) {
      setTimeout(popNext, 160);
    } else {
      mergeToMain();
    }
  }, 0);
}

/**
 * add to notifiaction queue
 * @return `id`
 */
function add(notification: VnNotificationOptions): NotificationId {
  const queue = isBusy.value ? tempQ : mainQ;
  const id = genId();

  queue.value.push({
    ...notification,
    id,
  });

  return id;
}

/**
 * remove notification with `id`
 * @param id notification id
 */
function remove(id: NotificationId): void {
  const index = mainQ.value.findIndex(({ id: $id }) => id === $id);
  if (index !== undefined) {
    mainQ.value.splice(index, 1);
    // stack();
    mainQ.value.length > 0 && adjustDeck();
  }
}

watch(
  () => mainQ.value.length,
  (nv, ov) => {
    ov > nv && stack();
  },
  { deep: true }
);

function useNotifications() {
  return {
    notifications: mainQ,
    remove,
    add,
    destroy,
  };
}

export { useNotifications };
