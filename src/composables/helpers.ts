import type { NotificationType } from '../types/basic';

type ValidTimeout = number;

function isValidTimeout(timeout: any): timeout is ValidTimeout {
  return Number(timeout) >= 0 && Number.isFinite(timeout);
}

function isValidType(type: any): type is NotificationType {
  return ['info', 'success', 'error', 'warning'].includes(type);
}

export { isValidTimeout, isValidType };
