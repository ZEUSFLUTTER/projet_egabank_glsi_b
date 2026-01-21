export interface Client {
  id: number; // Unique identifier for the client
  name: string; // Name of the client
  email: string; // Email address of the client
  phone?: string; // Optional phone number of the client
  address?: string; // Optional address of the client
}