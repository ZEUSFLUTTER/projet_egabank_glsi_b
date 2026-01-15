# Client Management API Documentation

Base URL: `/api/clients`

These endpoints allow for the management of bank clients.

## 1. Get All Clients

Retrieves a list of all registered clients.

- **Endpoint**: `/`
- **Method**: `GET`
- **Parameters**: None

### Response Body

Returns a JSON array of Client objects.

**Example Response:**
```json
[
  {
    "id": 1,
    "email": "client@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "CLIENT",
    "phoneNumber": "0123456789",
    "address": "123 Main St",
    "gender": "M",
    "birthDate": "1990-01-01",
    "nationality": "France",
    "active": true
  }
]
```

---

## 2. Get Client by ID

Retrieves a specific client's details.

- **Endpoint**: `/{id}`
- **Method**: `GET`
- **Path Variables**:
  - `id` (Long): The unique ID of the client.

### Response Body

Returns a single Client object.

**Example Response:**
```json
{
  "id": 1,
  "email": "client@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "CLIENT",
  "phoneNumber": "0123456789",
  "address": "123 Main St",
  "gender": "M",
  "birthDate": "1990-01-01",
  "nationality": "France"
}
```

---

## 3. Create Client

Creates a new client manually (Administrative action).

- **Endpoint**: `/`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body (`Client`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | String | Yes | First Name |
| `lastName` | String | Yes | Last Name |
| `email` | String | Yes | Email Address |
| `password` | String | Yes | Password |
| `phoneNumber`| String | Yes | Phone Number |
| `address` | String | Yes | Physical Address |
| `gender` | String | Yes | 'M', 'F', or 'Autre' |
| `birthDate` | Date | Yes | YYYY-MM-DD (must be largely in past) |
| `nationality`| String | Yes | Nationality |

**Example Request:**
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice@example.com",
  "password": "securePass123",
  "phoneNumber": "0987654321",
  "address": "456 Oak Ave",
  "gender": "F",
  "birthDate": "1985-05-15",
  "nationality": "USA"
}
```

---

## 4. Update Client

Updates an existing client's information.

- **Endpoint**: `/{id}`
- **Method**: `PUT`
- **Path Variables**:
  - `id` (Long): Client ID to update

### Request Body (`Client`)

Fields to update. ID in body is ignored in favor of path variable.

**Example Request:**
```json
{
  "phoneNumber": "111222333",
  "address": "789 New Address St"
}
```

---

## 5. Delete Client

Deletes a client from the system. **Important: Client must empty all accounts before deletion.**

- **Endpoint**: `/{id}`
- **Method**: `DELETE`
- **Path Variables**:
  - `id` (Long): Client ID to delete

### Validation

Before a client can be deleted, the system checks:
- Client must have **zero balance** across all accounts
- If client has funds in any account, deletion is rejected with HTTP 409 Conflict

### Success Response

Returns HTTP `204 No Content` on successful deletion.

### Error Response (Account Has Funds)

Returns HTTP `409 Conflict` if client has remaining balance:

```json
{
  "status": 409,
  "message": "Impossible de supprimer le compte",
  "error": "Account balance not empty",
  "timestamp": "2026-01-15T10:30:00",
  "path": "/api/clients/1",
  "details": [
    "Vous devez d'abord vider tous vos comptes avant de supprimer votre compte. Solde total: 1500.00 FCFA"
  ]
}
```

### Error Response (Client Not Found)

Returns HTTP `404 Not Found` if the client doesn't exist.

---

## 6. Change Password

Allows a client to change their password.

- **Endpoint**: `/{id}/password`
- **Method**: `PUT`
- **Path Variables**:
  - `id` (Long): Client ID whose password to change
- **Content-Type**: `application/json`

### Request Body (`ChangePasswordRequest`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `newPassword` | String | Yes | New password |
| `confirmPassword` | String | Yes | Password confirmation (must match newPassword) |

**Example Request:**
```json
{
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

### Success Response

Returns HTTP `200 OK` with a success message:

```json
{
  "status": 200,
  "message": "Mot de passe modifié avec succès",
  "error": null,
  "timestamp": "2026-01-15T10:30:00",
  "path": "/api/clients/1/password",
  "details": null
}
```

### Error Responses

#### Passwords Don't Match (HTTP 400)
```json
{
  "status": 400,
  "message": "Les mots de passe ne correspondent pas",
  "error": "Passwords do not match",
  "timestamp": "2026-01-15T10:30:00",
  "path": "/api/clients/1/password",
  "details": [
    "New password and confirm password must be identical"
  ]
}
```

#### Password Too Short (HTTP 400)
```json
{
  "status": 400,
  "message": "Le mot de passe doit contenir au moins 8 caractères",
  "error": "Password too short",
  "timestamp": "2026-01-15T10:30:00",
  "path": "/api/clients/1/password",
  "details": [
    "Password must be at least 8 characters long"
  ]
}
```

#### Client Not Found (HTTP 404)
```json
{
  "status": 404,
  "message": "Client non trouvé",
  "error": "Client not found",
  "timestamp": "2026-01-15T10:30:00",
  "path": "/api/clients/1/password",
  "details": null
}
```

