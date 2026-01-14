# Account Management API Documentation

Base URL: `/api/accounts`

These endpoints manage bank accounts (Savings, Checking, etc.) for clients.

## 1. Get All Accounts

Retrieves all bank accounts in the system.

- **Endpoint**: `/`
- **Method**: `GET`

### Response Body

Returns a JSON array of Account objects.

**Example Response:**
```json
[
  {
    "id": 101,
    "accountNumber": "FR7612345678",
    "accountType": "CURRENT",
    "balance": 1500.50,
    "creationDate": "2023-01-01",
    "owner": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

---

## 2. Get Account by ID

Retrieves details of a specific account.

- **Endpoint**: `/{id}`
- **Method**: `GET`
- **Path Variables**:
  - `id` (Long): The account ID.

---

## 3. Create Account

Creates a new bank account for a client.

- **Endpoint**: `/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body (`Account`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `accountNumber` | String | Yes | Unique account number string |
| `accountType` | String | Yes | Enum: `CURRENT`, `SAVINGS` |
| `balance` | Double | No | Initial balance (defaults 0.0) |
| `owner` | Object | Yes | Must contain valid `id` of existing client |

**Example Request:**
```json
{
  "accountNumber": "FR0000001",
  "accountType": "SAVINGS",
  "balance": 100.0,
  "owner": {
    "id": 2
  }
}
```

---

## 4. Update Account

Updates account details (e.g., status, constraints).

- **Endpoint**: `/{id}`
- **Method**: `PUT`
- **Path Variables**: `id`

### Request Body (`Account`)
Similar to Create Account, but used for modification.

---

## 5. Delete Account

Deletes an account.

- **Endpoint**: `/{id}`
- **Method**: `DELETE`

---

## 6. Get Accounts by Client

Retrieves all accounts owned by a specific client.

- **Endpoint**: `/client/{clientId}`
- **Method**: `GET`

---

## 7. Download Account Statements (PDF)

Endpoints to generate and download PDF statements.

### Full Statement
- **Endpoint**: `/{id}/statement`
- **Method**: `GET`
- **Response**: `application/pdf` binary stream.

### Period Statement
- **Endpoint**: `/{id}/statement/period`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (ISO DateTime): e.g. `2024-01-01T00:00:00`
  - `endDate` (ISO DateTime): e.g. `2024-01-31T23:59:59`
- **Response**: `application/pdf` binary stream.
