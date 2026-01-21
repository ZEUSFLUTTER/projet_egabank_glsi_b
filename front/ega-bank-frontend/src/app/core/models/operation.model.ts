export interface Operation {
  id: number;          // Unique identifier for the operation
  amount: number;      // Amount involved in the operation
  type: string;        // Type of operation (e.g., 'deposit', 'withdrawal', 'transfer')
  date: Date;          // Date and time when the operation occurred
  compteId: number;    // Identifier of the account associated with the operation
  clientId: number;    // Identifier of the client associated with the operation
}