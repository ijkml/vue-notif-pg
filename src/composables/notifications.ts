import { ref } from 'vue';
import type { VnNotificationOptions } from '../types/basic';

type NotificationId = string;

interface VnNotificationOptionsWithID extends VnNotificationOptions {
  id: NotificationId;
}

// simple, efficient and cheap id store
const vnID = ref(8);

// generate new id on demand
function genId(): NotificationId {
  vnID.value += 3;
  return `vn-notif-${vnID.value}`;
}

// main notifications queue
const mainQ = ref<VnNotificationOptionsWithID[]>([]);
// temp notifications queue
const tempQ = ref<VnNotificationOptionsWithID[]>([]);
// is main notification queue busy/idle
const isBusy = ref<boolean>(false);

/**
 * removes the last item from the notifications array
 * @returns whether the array is empty or not
 */
function __removeLast(): boolean {
  const done = mainQ.value.shift();
  return done === undefined;
}

/**
 *
 * @param notif notification object
 * @returns true/false whether the process is done
 */
function __pushNext(notif: VnNotificationOptionsWithID | undefined): boolean {
  if (notif === undefined) {
    return true;
  }

  mainQ.value.push(notif);
  return false;
}

/**
 * adds the temp queue back to main queue
 */
function _mergeToMain(): void {
  isBusy.value = false;

  const c = tempQ.value;

  // recursively (and smoothly) add each item to the main queue
  // every 160ms
  setTimeout(function addNext() {
    const done = __pushNext(c.shift());

    if (!done) {
      setTimeout(addNext, 160);
    } else {
      tempQ.value = [];
    }
  }, 0);
}

/**
 * remove all notifications
 */
function destroy(): void {
  // recursively (and smoothly) remove the last item every 160ms
  setTimeout(function popNext() {
    isBusy.value = true;
    const done = __removeLast();

    if (!done) {
      setTimeout(popNext, 160);
    } else {
      _mergeToMain();
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

const notifications = mainQ;

function useNotifications() {
  return {
    notifications,
    remove,
    add,
    destroy,
  };
}

export { notifications, useNotifications };
