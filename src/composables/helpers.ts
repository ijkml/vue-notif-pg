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

function adjustDeck(elem: HTMLElement) {
  const len = mainQ.value.length - 1;
  const { id: faceId } = mainQ.value[len];
  const face = document.getElementById(faceId)?.parentElement;

  if (!(face && elem && len >= 0)) {
    return;
  }

  // reset forced height
  face.style.height = '';
  face.style.maxHeight = '';
  // set height
  const deckHeight = face.offsetHeight ? `${face.offsetHeight}px` : '';
  elem.style.height = deckHeight;
  elem.style.maxHeight = deckHeight;
}

function stack(): void {
  const len = mainQ.value.length - 1;

  if (len < 0) {
    return;
  }

  mainQ.value.forEach(({ id }, i) => {
    const elem = document.getElementById(id)?.parentElement;

    if (elem) {
      elem.style.transform = `translate3d(0, ${85 * (len - i)}%, -${
        len - i
      }px) scale(${1 - 0.05 * (len - i)})`;
      adjustDeck(elem);
      const hidden = len - i >= maxStack;
      toggleVisibility(elem, hidden);
      // el.setAttribute('aria-hidden', 'true');
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

function getAnimationEvent(el: HTMLElement): string | undefined {
  const animations: { [k: string]: string } = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'Animationend',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (const key of Object.keys(animations)) {
    if (el.style[key as any] !== undefined) {
      return animations[key];
    }
  }
  return;
}

function removeOne(index: number): void {
  mainQ.value.splice(index, 1);
  stack();
}

export {
  removeLast,
  mergeToMain,
  stack,
  getLast,
  removeOne,
  getAnimationEvent,
};
