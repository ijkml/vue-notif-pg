import type { VnNotificationOptions, NotificationId } from '@/types';
import { genId, isBusy, mainQ, tempQ } from './store';
import { removeLast, mergeToMain } from './helpers';

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
  if (id) {
    mainQ.value = mainQ.value.filter((m) => m.id !== id);
  }
}

function useNotifications() {
  return {
    notifications: mainQ,
    remove,
    add,
    destroy,
  };
}

export { useNotifications };
