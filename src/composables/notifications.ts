import type { VnNotificationOptions, NotificationId } from '@/types';
import { genId, isBusy, mainQ, maxStack, tempQ } from './store';
import {
  removeLast,
  mergeToMain,
  removeOne,
  getAnimationEvent,
} from './helpers';

/**
 * remove all notifications
 */
function destroy(): void {
  // recursively (and smoothly) remove the first item
  // of the array every 200ms
  setTimeout(function popNext() {
    isBusy.value = true;

    // when destroying, first remove all hidden
    // instances, prevent them from wasting time
    while (mainQ.value.length > maxStack) {
      mainQ.value.shift();
    }

    const done = removeLast();

    if (!done) {
      setTimeout(popNext, 200);
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
async function remove(id: NotificationId): Promise<void> {
  const index = mainQ.value.findIndex(({ id: $id }) => id === $id);
  if (index === undefined) {
    return;
  }

  const el = document.getElementById(id);
  if (!el) {
    removeOne(index);
    return;
  }

  const eventName = getAnimationEvent(el);

  await new Promise((resolve) => {
    if (eventName) {
      el.addEventListener(eventName, () => resolve(0));
    }
    resolve(0);
  }).then(() => {
    removeOne(index);
  });
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
