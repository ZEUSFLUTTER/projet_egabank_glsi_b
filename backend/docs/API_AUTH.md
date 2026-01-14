# Authentication API Documentation

Base URL: `/api/auth`

This API provides endpoints for user authentication (login), registration, and token management. It supports two types of users: **CLIENT** and **ADMIN**.

## 1. Login

Authenticates a user and returns a Json Web Token (JWT).

- **Endpoint**: `/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body (`AuthRequest`)

| Field | Type | Required | Description | Validation |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | Yes | User's email address | Must be a valid email format |
| `password` | String | Yes | User's password | Minimum 6 characters |

**Example Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Body (`AuthResponse`)

Returns HTTP `200 OK` on success.

| Field | Type | Description |
| :--- | :--- | :--- |
| `token` | String | The JWT access token |
| `tokenType` | String | Type of token (Always "Bearer") |
| `expiresIn` | Long | Token expiration time in seconds |
| `userType` | String | Role of the user ("CLIENT" or "ADMIN") |
| `userId` | Long | Unique ID of the user |
| `email` | String | User's email address |

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userType": "CLIENT",
  "userId": 1,
  "email": "user@example.com"
}
```

### Errors
- `401 Unauthorized`: Invalid credentials (BadCredentialsException).
- `400 Bad Request`: Validation errors (e.g., invalid email format).

---

## 2. Register

Registers a new user (Client or Admin) and returns an authentication token immediately upon success.

- **Endpoint**: `/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body (`RegisterRequest`)

**Common Fields (Required for ALL)**

| Field | Type | Required | Description | Validation |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | Yes | User's email address | Valid email |
| `password` | String | Yes | User's password | 6-50 characters |
| `firstName` | String | Yes | User's first name | 2-50 characters |
| `lastName` | String | Yes | User's last name | 2-50 characters |
| `userType` | String | Yes | "CLIENT" or "ADMIN" | Must match exactly |

**Client-Specific Fields (Required ONLY if userType="CLIENT")**

| Field | Type | Required | Description | Format |
| :--- | :--- | :--- | :--- | :--- |
| `phoneNumber`| String | Yes | Phone number | - |
| `address` | String | Yes | Physical address | - |
| `gender` | String | Yes | Gender | - |
| `birthDate` | String | Yes | Date of birth | `YYYY-MM-DD` |
| `nationality`| String | Yes | Nationality | - |

**Example Request (CLIENT):**
```json
{
  "email": "client@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "CLIENT",
  "phoneNumber": "+123456789",
  "address": "123 Main St",
  "gender": "Male",
  "birthDate": "1990-01-01",
  "nationality": "American"
}
```

**Example Request (ADMIN):**
```json
{
  "email": "admin@example.com",
  "password": "adminPass123",
  "firstName": "Admin",
  "lastName": "User",
  "userType": "ADMIN"
}
```

### Response Body (`AuthResponse`)

Returns HTTP `201 Created` on success. The response structure is identical to the Login response.

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userType": "CLIENT",
  "userId": 2,
  "email": "client@example.com"
}
```

### Errors
- `400 Bad Request`: Validation errors or missing client-specific fields.
- `400 Bad Request` (IllegalArgumentException): Email already exists.

---

## 3. Refresh Token

Generates a new JWT token for an already authenticated user.

- **Endpoint**: `/refresh`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <expired_or_valid_token>`

### Request

No body required. The endpoint relies on the `Authorization` header.

### Response Body (`AuthResponse`)

Returns HTTP `200 OK` on success with a new token.

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9... (new token)",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userType": "CLIENT",
  "userId": 1,
  "email": "user@example.com"
}
```

### Errors
- `403 Forbidden` / `401 Unauthorized`: Invalid or malformed token.
