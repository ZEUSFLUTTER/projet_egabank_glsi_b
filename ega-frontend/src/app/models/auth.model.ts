export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  nationality: string;
  createdAt?: string;
  accountCount?: number;
  active?: boolean;
}

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  phone: string;
  email: string;
  nationality: string;
}

export interface Account {
  id: number;
  accountNumber: string;
  type: string;
  createdAt: string;
  balance: number;
  ownerId: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
}

export interface AccountCreateRequest {
  ownerId: number | null;
  type: string;
  initialBalance: number;
}

export interface Transaction {
  // Backend TransactionResponse fields
  id: number;
  type: 'CREDIT' | 'DEBIT' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  operationDate: string;
  sourceAccount?: string | null;
  destinationAccount?: string | null;
}
