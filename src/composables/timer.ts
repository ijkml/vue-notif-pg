import { isValidTimeout } from './checkers';

const notZero = (num: any): num is number => {
  return isValidTimeout(num) && num > 0;
};

export function useTimer(
  callback: () => void = () => {},
  delay: number
): {
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
} {
  const isValid = notZero(delay);

  let pause = () => {};
  let resume = () => {};
  let reset = () => {};
  let stop = () => {};

  if (isValid) {
    let timerId: number;
    let start: number;
    let remaining: number = delay;

    pause = () => {
      window.clearTimeout(timerId);
      remaining -= Date.now() - start;
    };

    resume = () => {
      start = Date.now();
      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, remaining);
    };

    reset = () => {
      start = Date.now();
      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, delay);
    };

    stop = () => window.clearTimeout(timerId);

    resume();
  }
  return { pause, resume, reset, stop };
}

export function useTicker(
  callback: () => void = () => {},
  interval: number
): { start: () => void; stop: () => void } {
  let start = () => {};
  let stop = () => {};

  if (notZero(interval)) {
    let id: number;

    start = () => {
      id = window.setInterval(callback, interval);
    };
    stop = () => window.clearInterval(id);
  }

  start();
  return { start, stop };
}

export type UseTickerReturnType = ReturnType<typeof useTicker>;
export type UseTimerReturnType = ReturnType<typeof useTimer>;
