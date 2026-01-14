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

Deletes a client from the system.

- **Endpoint**: `/{id}`
- **Method**: `DELETE`
- **Path Variables**:
  - `id` (Long): Client ID to delete

### Response

Returns HTTP `200 OK` or `204 No Content` on success.
