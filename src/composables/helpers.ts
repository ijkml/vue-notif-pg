import type { VnNotificationOptionsWithID } from '@/types';
import { mainQ, tempQ, isBusy, maxStack } from './store';

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

function adjustSingle(elem: HTMLElement) {
  const len = mainQ.value.length - 1;
  const { id: faceId } = mainQ.value[len];
  const face = document.getElementById(faceId)?.parentElement;

  if (!(face && elem && len >= 0)) {
    return;
  }

  // reset stylings
  face.style.height = '';
  face.style.maxHeight = '';

  const deckHeight = face.offsetHeight ? `${face.offsetHeight}px` : '';
  elem.style.height = deckHeight;
  elem.style.maxHeight = deckHeight;
}

function adjustDeck() {
  mainQ.value.forEach(({ id }) => {
    const elem = document.getElementById(id)?.parentElement;
    if (elem) {
      adjustSingle(elem);
    }
  });
}

function stack(): void {
  const len = mainQ.value.length - 1;

  mainQ.value.forEach(({ id }, i) => {
    const elem = document.getElementById(id)?.parentElement;

    if (elem) {
      elem.style.transform = `translate3d(0, ${85 * (len - i)}%, -${
        len - i
      }px) scale(${1 - 0.05 * (len - i)})`;

      adjustSingle(elem);
      const hidden = len - i >= maxStack;
      toggleVisibility(elem, hidden);
    }
  });
}

function toggleVisibility(el: HTMLElement, hidden: boolean) {
  if (hidden) {
    window.setTimeout(() => {
      el.style.visibility = 'hidden';
    }, 300);
    el.style.opacity = '0';
  } else {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  }
}

function getLast(): VnNotificationOptionsWithID | undefined {
  return mainQ.value[mainQ.value.length - 1];
}

export { removeLast, mergeToMain, stack, getLast, adjustDeck };
