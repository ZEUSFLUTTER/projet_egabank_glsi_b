# Transaction Management API Documentation

Base URL: `/api/transactions`

These endpoints handle financial transactions (deposits, withdrawals, transfers) between accounts.

## 1. Get All Transactions

Retrieves a global list of all transactions.

- **Endpoint**: `/`
- **Method**: `GET`

### Response Body

Returns a JSON array of Transaction objects.

**Example Response:**
```json
[
  {
    "id": 5001,
    "amount": 200.0,
    "transactionDate": "2024-03-15T10:30:00",
    "transactionType": "DEPOSIT",
    "description": "Cash Deposit",
    "sourceAccount": {
      "id": 101,
      "accountNumber": "FR7612345678"
    }
  }
]
```

---

## 2. Get Transaction by ID

Retrieves details of a single transaction.

- **Endpoint**: `/{id}`
- **Method**: `GET`
- **Path Variables**:
  - `id` (Long): The transaction ID.

---

## 3. Create Transaction

Executes a new transaction.

- **Endpoint**: `/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body (`Transaction`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `amount` | Double | Yes | Amount to transact |
| `transactionType` | String | Yes | Enum: `DEPOSIT`, `WITHDRAWAL`, `TRANSFER` |
| `sourceAccount` | Object | Yes | Must contain `id` only |
| `destinationAccount`| Object | *Conditional*| Required if Type is `TRANSFER` (contains `id`) |
| `description` | String | No | Optional description |

**Example Request (Deposit):**
```json
{
  "amount": 500.0,
  "transactionType": "DEPOSIT",
  "description": "Salary",
  "sourceAccount": { "id": 101 }
}
```

**Example Request (Transfer):**
```json
{
  "amount": 150.0,
  "transactionType": "TRANSFER",
  "sourceAccount": { "id": 101 },
  "destinationAccount": { "id": 102 }
}
```

---

## 4. Get Transactions by Account

Retrieves history for a specific account.

- **Endpoint**: `/account/{accountId}`
- **Method**: `GET`

---

## 5. Get Transactions by Account & Period

Retrieves filtered history for an account within a date range.

- **Endpoint**: `/account/{accountId}/period`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (ISO DateTime): e.g. `2024-01-01T00:00:00`
  - `endDate` (ISO DateTime): e.g. `2024-12-31T23:59:59`

### Response Body

Returns a list of transactions matching the criteria.

---

# Admin API Documentation

Base URL: `/api/admin`

These endpoints are for administrative operations. Admins can view detailed information about clients and their transactions.

## 1. Get Client Transactions

Retrieves all transactions for a specific client across all their accounts.

- **Endpoint**: `/clients/{clientId}/transactions`
- **Method**: `GET`
- **Path Variables**:
  - `clientId` (Long): The ID of the client

### Response Body

Returns a JSON array of Transaction objects for the specified client, sorted by transaction date (newest first).

**Example Response:**
```json
[
  {
    "id": 5001,
    "amount": 500.0,
    "transactionDate": "2024-03-15T10:30:00",
    "transactionType": "DEPOSIT",
    "description": "Salary",
    "sourceAccount": {
      "id": 101,
      "accountNumber": "FR7612345678"
    },
    "destinationAccount": null
  },
  {
    "id": 5002,
    "amount": 200.0,
    "transactionDate": "2024-03-14T15:45:00",
    "transactionType": "WITHDRAWAL",
    "description": "ATM Withdrawal",
    "sourceAccount": {
      "id": 101,
      "accountNumber": "FR7612345678"
    },
    "destinationAccount": null
  }
]
```

### Errors
- `200 OK`: Returns empty list if client has no transactions
- `404 Not Found`: If the client does not exist (implementation may vary)
