import type { VnNotificationOptionsWithID } from '@/types';
import { mainQ, tempQ, isBusy } from './store';

/**
 * removes the last item from the notifications array
 * @returns whether the array is empty or not
 */
function removeLast(): boolean {
  const done = mainQ.value.shift();
  return done === undefined;
}

/**
 *
 * @param notif notification object
 * @returns true/false whether the process is done
 */
function pushNext(notif: VnNotificationOptionsWithID | undefined): boolean {
  if (notif === undefined) {
    return true;
  }

  mainQ.value.push(notif);
  return false;
}

/**
 * adds the temp queue back to main queue
 */
function mergeToMain(): void {
  isBusy.value = false;

  const c = tempQ.value;

  // recursively (and smoothly) add each item to the main queue
  // every 160ms
  setTimeout(function addNext() {
    const done = pushNext(c.shift());

    if (!done) {
      setTimeout(addNext, 160);
    } else {
      tempQ.value = [];
    }
  }, 0);
}

export { removeLast, mergeToMain };
