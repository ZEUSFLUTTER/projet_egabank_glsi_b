# Requirements Document - EGA Bank

## Introduction

EGA Bank est un système de gestion bancaire complet permettant la gestion des clients, des comptes bancaires et des transactions. Le système comprend une API REST backend sécurisée et une interface utilisateur Angular moderne pour offrir une expérience bancaire numérique complète.

## Glossary

- **System**: Le système EGA Bank dans son ensemble
- **Backend_API**: L'API REST Spring Boot qui gère la logique métier
- **Frontend_App**: L'application Angular qui fournit l'interface utilisateur
- **Client**: Un utilisateur du système bancaire (personne physique)
- **Account**: Un compte bancaire appartenant à un client
- **Transaction**: Une opération bancaire (dépôt, retrait, virement)
- **Admin**: Un utilisateur administrateur du système
- **JWT_Token**: Token d'authentification JSON Web Token
- **IBAN**: Numéro de compte au format International Bank Account Number

## Requirements

### Requirement 1: Gestion des Clients

**User Story:** En tant qu'administrateur, je veux gérer les clients de la banque, afin de maintenir une base de données complète et à jour des clients.

#### Acceptance Criteria

1. THE Backend_API SHALL provide CRUD operations for client management
2. WHEN creating a client, THE System SHALL validate all required fields (nom, prénom, date de naissance, sexe, adresse, téléphone, courriel, nationalité)
3. WHEN a client email is provided, THE System SHALL validate the email format
4. WHEN a client phone number is provided, THE System SHALL validate the phone format
5. THE System SHALL ensure client email addresses are unique across the system
6. WHEN retrieving clients, THE Backend_API SHALL return paginated results for performance

### Requirement 2: Gestion des Comptes Bancaires

**User Story:** En tant qu'administrateur, je veux gérer les comptes bancaires, afin de permettre aux clients d'effectuer des opérations bancaires.

#### Acceptance Criteria

1. THE Backend_API SHALL provide CRUD operations for account management
2. WHEN creating an account, THE System SHALL generate a unique IBAN format account number
3. WHEN creating an account, THE System SHALL set the initial balance to zero
4. THE System SHALL support two account types: épargne and courant
5. WHEN creating an account, THE System SHALL associate it with an existing client
6. THE System SHALL ensure each account number is unique across the system
7. WHEN retrieving accounts, THE System SHALL include the associated client information

### Requirement 3: Opérations Bancaires - Dépôts

**User Story:** En tant que client, je veux effectuer des dépôts sur mon compte, afin d'augmenter mon solde disponible.

#### Acceptance Criteria

1. WHEN a deposit transaction is requested, THE Backend_API SHALL validate the amount is positive
2. WHEN a valid deposit is processed, THE System SHALL increase the account balance by the deposit amount
3. WHEN a deposit is completed, THE System SHALL create a transaction record with type "DEPOT"
4. WHEN a deposit is processed, THE System SHALL update the transaction timestamp
5. THE System SHALL ensure deposit operations are atomic to prevent data inconsistency

### Requirement 4: Opérations Bancaires - Retraits

**User Story:** En tant que client, je veux effectuer des retraits de mon compte, afin d'accéder à mes fonds disponibles.

#### Acceptance Criteria

1. WHEN a withdrawal transaction is requested, THE Backend_API SHALL validate the amount is positive
2. WHEN a withdrawal is requested, THE System SHALL verify sufficient account balance exists
3. IF insufficient balance exists, THEN THE System SHALL reject the withdrawal and return an error message
4. WHEN a valid withdrawal is processed, THE System SHALL decrease the account balance by the withdrawal amount
5. WHEN a withdrawal is completed, THE System SHALL create a transaction record with type "RETRAIT"
6. THE System SHALL ensure withdrawal operations are atomic to prevent data inconsistency

### Requirement 5: Opérations Bancaires - Virements

**User Story:** En tant que client, je veux effectuer des virements entre comptes, afin de transférer des fonds facilement.

#### Acceptance Criteria

1. WHEN a transfer transaction is requested, THE Backend_API SHALL validate both source and destination accounts exist
2. WHEN a transfer is requested, THE System SHALL verify sufficient balance in the source account
3. IF insufficient balance exists, THEN THE System SHALL reject the transfer and return an error message
4. WHEN a valid transfer is processed, THE System SHALL decrease the source account balance and increase the destination account balance by the same amount
5. WHEN a transfer is completed, THE System SHALL create transaction records for both accounts with type "VIREMENT"
6. THE System SHALL ensure transfer operations are atomic across both accounts to prevent data inconsistency
7. THE System SHALL prevent transfers from an account to itself

### Requirement 6: Historique des Transactions

**User Story:** En tant que client, je veux consulter l'historique de mes transactions, afin de suivre l'activité de mes comptes.

#### Acceptance Criteria

1. THE Backend_API SHALL provide endpoints to retrieve transaction history by account
2. WHEN requesting transaction history, THE System SHALL support filtering by date range
3. WHEN no date range is specified, THE System SHALL return transactions from the last 30 days by default
4. WHEN retrieving transactions, THE System SHALL return results ordered by date (most recent first)
5. THE System SHALL include all transaction details: amount, type, date, and involved accounts
6. THE Backend_API SHALL support pagination for transaction history to handle large datasets

### Requirement 7: Génération de Relevés Bancaires

**User Story:** En tant que client, je veux générer des relevés bancaires, afin d'avoir un document officiel de mes transactions.

#### Acceptance Criteria

1. THE Frontend_App SHALL provide functionality to generate PDF bank statements
2. WHEN generating a statement, THE System SHALL include client information, account details, and transaction history
3. WHEN generating a statement, THE System SHALL support custom date ranges
4. THE System SHALL format the PDF statement with professional banking layout
5. WHEN a statement is generated, THE System SHALL include account balance at the beginning and end of the period
6. THE Frontend_App SHALL allow users to download the generated PDF statement

### Requirement 8: Authentification et Sécurité

**User Story:** En tant qu'utilisateur du système, je veux une authentification sécurisée, afin de protéger mes données bancaires.

#### Acceptance Criteria

1. THE Backend_API SHALL implement JWT-based authentication using Spring Security
2. WHEN a user logs in with valid credentials, THE System SHALL generate a JWT token
3. WHEN accessing protected endpoints, THE System SHALL validate the JWT token
4. IF an invalid or expired token is provided, THEN THE System SHALL return an authentication error
5. THE System SHALL support role-based access control with ADMIN and CLIENT roles
6. WHEN a JWT token expires, THE System SHALL require re-authentication
7. THE System SHALL hash and salt all passwords before storing them
8. THE Backend_API SHALL implement CORS configuration to allow frontend access

### Requirement 9: Validation et Gestion d'Erreurs

**User Story:** En tant que développeur, je veux une gestion d'erreurs robuste, afin d'assurer la fiabilité du système.

#### Acceptance Criteria

1. THE Backend_API SHALL implement global exception handling for all endpoints
2. WHEN validation errors occur, THE System SHALL return descriptive error messages
3. WHEN business rule violations occur, THE System SHALL return appropriate HTTP status codes
4. THE System SHALL validate all input data using Jakarta Validation annotations
5. WHEN database errors occur, THE System SHALL handle them gracefully and return user-friendly messages
6. THE System SHALL log all errors for debugging and monitoring purposes
7. THE Frontend_App SHALL display user-friendly error messages for all error scenarios

### Requirement 10: Interface Utilisateur Angular

**User Story:** En tant qu'utilisateur, je veux une interface moderne et intuitive, afin d'utiliser facilement les services bancaires.

#### Acceptance Criteria

1. THE Frontend_App SHALL provide responsive design that works on desktop and mobile devices
2. THE Frontend_App SHALL implement authentication pages (login and registration)
3. THE Frontend_App SHALL provide a dashboard showing account summaries and recent transactions
4. THE Frontend_App SHALL allow clients to view their profile information and account details
5. THE Frontend_App SHALL provide forms for performing banking operations (deposits, withdrawals, transfers)
6. THE Frontend_App SHALL display transaction history with filtering capabilities
7. THE Frontend_App SHALL implement proper navigation and routing between pages
8. THE Frontend_App SHALL provide visual feedback for all user actions (loading states, success/error messages)

### Requirement 11: Tests et Documentation API

**User Story:** En tant que développeur, je veux des tests complets et une documentation API, afin de maintenir et faire évoluer le système efficacement.

#### Acceptance Criteria

1. THE System SHALL provide a complete Postman collection testing all API endpoints
2. THE Postman collection SHALL include test cases for both success and error scenarios
3. THE System SHALL provide environment configuration for different deployment stages
4. THE Backend_API SHALL document all endpoints with proper HTTP methods and response formats
5. THE System SHALL include automated tests for all critical business logic
6. THE System SHALL provide setup scripts for easy project initialization
7. THE System SHALL include comprehensive README documentation for deployment and usage