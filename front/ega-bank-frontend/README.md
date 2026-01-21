# EGA Bank Frontend

## Description
This project is the frontend for the EGA Bank application, built using Angular. It provides a user interface for both admin and client functionalities, allowing for the management of clients, accounts, transactions, and historical data.

## Project Structure
The project is organized into several modules:

- **Admin Module**: Contains components for managing clients, accounts, transactions, and viewing historical data.
  - Dashboard
  - CRUD operations for Clients, Accounts, and Transactions
  - Historical view

- **Client Module**: Provides functionalities for clients to view their accounts, transaction history, and perform operations such as deposits, withdrawals, and transfers.
  - Accounts table
  - Operations history
  - Operation forms

## Technologies Used
- Angular: Frontend framework for building the application.
- Tailwind CSS: Utility-first CSS framework for styling the application.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ega-bank-frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   ng serve
   ```
5. Open your browser and navigate to `http://localhost:4200`.

## Features
- Admin dashboard for managing bank operations.
- Client dashboard for viewing account details and transaction history.
- Responsive design using Tailwind CSS.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.