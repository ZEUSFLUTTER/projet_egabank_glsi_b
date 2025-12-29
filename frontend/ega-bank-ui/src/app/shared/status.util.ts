import { Account } from '../mock-data';

export type AccountStatus = Account['status'];

export function statusClassObject(status: AccountStatus) {
  return {
    'badge-success': status === 'active',
    'badge-warning': status === 'inactive',
    'badge-danger': status === 'closed' || status === 'suspended',
  } as Record<string, boolean>;
}

export function statusDisplay(status: AccountStatus) {
  // Normalize to capitalized form for display
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee';

export function transactionAmountClass(type: TransactionType) {
  const isNegative = type === 'withdrawal' || type === 'payment' || type === 'fee';
  return {
    'text-danger': isNegative,
    'text-success': !isNegative,
  } as Record<string, boolean>;
}

export function transactionSign(type: TransactionType) {
  return type === 'withdrawal' || type === 'payment' || type === 'fee' ? '-' : '+';
}
