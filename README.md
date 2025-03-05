# Inventory Management System

This is a simple inventory management system built using FastAPI and SQLAlchemy. It allows managing warehouses and items stored within them.

## Features
- Create and manage warehouses
- Add and track items in warehouses
- RESTful API built with FastAPI
- SQLite database using SQLAlchemy ORM

## Installation

### Prerequisites
- Python 3.8+
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn (for running the API server)

### Setup
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd inventory-management
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the application:
   ```sh
   uvicorn main:app --reload
   ```

## API Endpoints

### Warehouse Endpoints
- **Create Warehouse**
  - `POST /warehouses/`
  - **Request Body:**
    ```json
    {
      "name": "Main Warehouse",
      "location": "New York"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Main Warehouse",
      "location": "New York"
    }
    ```

### Item Endpoints
- **Create Item** *(To be implemented)*
- **List Items** *(To be implemented)*

## Database
- Uses SQLite (`inventory.db`)
- Tables:
  - `warehouses`: Stores warehouse details
  - `items`: Stores inventory items linked to a warehouse

## Future Enhancements
- Implement item management endpoints
- Add authentication and authorization
- Improve error handling
- Deploy to cloud service

## License
This project is licensed under the MIT License.

