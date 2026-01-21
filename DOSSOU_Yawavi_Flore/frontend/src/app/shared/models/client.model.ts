export interface Client {
  id?: number;
  codeClient?: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
  nationality: string;
  deleted?: boolean;
}

export interface ClientDto {
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
  nationality: string;
}

export interface ClientUpdateDto {
  address: string;
  phoneNumber: string;
  email: string;
}
