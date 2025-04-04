# 📦 Inventory Management System  

This is a full-stack **Inventory Management System** built using **FastAPI**, **SQLAlchemy**, and a **React frontend** with **Bootstrap 5** for styling. It allows users to manage warehouses, items, categories, stock movements, and users. It also supports **Docker** for containerized deployment and uses **PostgreSQL** as the database.

---

## 🚀 Features  

### Backend Features  
- **Warehouse Management**  
  - Create, update, delete, and view warehouses.  
  - Retrieve stock levels for specific warehouses.  

- **Item Management**  
  - Add, edit, delete, and view items.  
  - Assign items to categories.  

- **Category Management**  
  - Create, update, delete, and view categories.  
  - Retrieve items associated with specific categories.  

- **Stock Management**  
  - Track stock levels across warehouses.  
  - Add or remove stock through stock movements.  

- **User Management**  
  - Register new users with roles (admin/user).  
  - View, edit, and delete user details.  

- **Authentication & Authorization**  
  - Role-based access control (admin and user roles).  
  - JWT-based authentication.  

- **Email Notifications**  
  - Send email notifications using SendGrid for specific events.  

- **API Documentation**  
  - Interactive API documentation available at `/docs` using Swagger UI.  

### Frontend Features  
- **Dashboard**  
  - Overview of warehouses, items, categories, and stock.  

- **Warehouse Management**  
  - Add, edit, delete, and view warehouse details.  

- **Item Management**  
  - Add, edit, delete, and view item details.  
  - Assign items to categories.  

- **Category Management**  
  - Add, edit, delete, and view categories.  

- **Stock Management**  
  - View stock levels grouped by warehouses.  
  - Add stock movements (inflow/outflow).  

- **User Management**  
  - Admins can manage users (add, edit, delete).  
  - Users can view and edit their profiles.  

- **Responsive Design**  
  - Fully responsive UI built with React and Bootstrap 5.  

- **Real-Time Updates**  
  - Interface updates dynamically as data changes.  

### Deployment Features  
- **Docker Support**  
  - Containerized deployment using Docker and Docker Compose.  

- **Environment Configuration**  
  - Configurable environment variables for API and database.  

---

## 🛠 Installation  

### 🔹 Backend Setup (FastAPI + PostgreSQL)  

#### 1️⃣ Prerequisites  
- Python 3.12.9+  
- FastAPI  
- SQLAlchemy  
- Pydantic  
- Uvicorn  
- PostgreSQL  
- Docker & Docker Compose (for containerized setup)  

#### 2️⃣ Clone the repository  
```sh
git clone https://github.com/lukaszfilo-agh/Inventory-Management
cd inventory-manager/api
```

#### 3️⃣ Install dependencies  
```sh
pip install -r requirements.txt
```

#### 4️⃣ Run the FastAPI server  
```sh
uvicorn main:app --reload
```

🔹 The API server will run at `http://127.0.0.1:8000/docs` (for interactive API documentation).  

---

### 🔹 Frontend Setup (React + Bootstrap 5)  

#### 1️⃣ Prerequisites  
- Node.js 14+  
- npm or yarn  

#### 2️⃣ Navigate to the frontend directory  
```sh
cd ../warehouse-manager
```

#### 3️⃣ Install dependencies  
```sh
npm install
```

#### 4️⃣ Start the React app  
```sh
npm start
```

🔹 The React app will run at `http://localhost:3000/`.

---

## 💪 Docker Setup  

### Running the App with Docker Compose  

#### 1️⃣ Ensure Docker and Docker Compose are installed  
#### 2️⃣ Navigate to the project root directory and run:  
```sh
docker-compose up --build
```

This will start the **FastAPI backend**, **React frontend**, and **PostgreSQL database** in Docker containers.  

#### 3️⃣ Stop the application  
```sh
docker-compose down
```

---

## 🔗 API Endpoints  

### 📃 Health Check  
- `GET /health` - Health Check  

### 📦 Warehouse Endpoints  
- `GET /warehouses/` - Get Warehouses  
- `POST /warehouses/` - Create Warehouse  
- `GET /warehouses/{warehouse_id}` - Get Warehouse  
- `PATCH /warehouses/{warehouse_id}` - Update Warehouse  
- `GET /warehouses/{warehouse_id}/stock` - Get Warehouse Stock  
- `DELETE /warehouses/{warehouse_id}` - Delete Warehouse  

### 💋 Category Endpoints  
- `GET /categories/` - Get Categories  
- `POST /categories/` - Create Category  
- `GET /categories/{category_id}` - Get Category  
- `PATCH /categories/{category_id}` - Update Category  
- `GET /categories/{category_id}/items` - Get Category Items  

### 📚 Item Endpoints  
- `GET /items/` - Get Items  
- `POST /items/` - Create Item  
- `GET /items/{item_id}` - Get Item  
- `PATCH /items/{item_id}` - Update Item  
- `DELETE /items/{item_id}` - Delete Item  

### 📊 Stock Endpoints  
- `GET /stock/` - Get all stock records  
- `POST /stock/add/{item_id}` - Add stock for an item in a warehouse  
- `GET /stock/get/{item_id}` - Get stock for a specific item  

### 👤 User Endpoints  
- `POST /users/register` - Register a new user  
- `GET /users/get` - Get all users  
- `GET /users/get/{user_id}` - Get user details  
- `PATCH /users/update/{user_id}` - Update user details  
- `DELETE /users/delete/{user_id}` - Delete a user  

---

## 🌐 Folder Structure  
```
📁 inventory-manager/
├───📁 backend/
│   ├───📁 app/
│   │   ├───📁 api/
│   │   │   ├───📁 routers/
│   │   │   │   ├───📄 __init__.py
│   │   │   │   ├───📄 category_router.py
│   │   │   │   ├───📄 health_router.py
│   │   │   │   ├───📄 item_router.py
│   │   │   │   ├───📄 stock_router.py
│   │   │   │   ├───📄 stockmovement_router.py
│   │   │   │   └───📄 warehouse_router.py
│   │   │   ├───📄 __init__.py
│   │   │   └───📄 main.py
│   │   ├───📁 core/
│   │   │   ├───📄 __init__.py
│   │   │   ├───📄 config.py
│   │   │   └───📄 database.py
│   │   ├───📁 models/
│   │   │   ├───📄 __init__.py
│   │   │   ├───📄 category_model.py
│   │   │   ├───📄 item_model.py
│   │   │   ├───📄 other_models_na.py
│   │   │   ├───📄 stock_model.py
│   │   │   ├───📄 stock_movement_model.py
│   │   │   └───📄 warehouse_model.py
│   │   ├───📁 schemas/
│   │   │   ├───📄 __init__.py
│   │   │   ├───📄 category_schema.py
│   │   │   ├───📄 item_schema.py
│   │   │   ├───📄 stock_schema.py
│   │   │   ├───📄 stockmovement_schema.py
│   │   │   └───📄 warehouse_schema.py
│   │   └───📄 main.py
│   ├───📄 .dockerignore
│   ├───📄 Dockerfile
│   ├───📄 Dockerfile.dev
│   ├───📄 db_clean.py
│   └───📄 requirements.txt
├───📁 frontend/
│   ├───📁 node_modules/
│   ├───📁 public/
│   │   ├───📄 favicon.ico
│   │   ├───📄 index.html
│   │   ├───📄 logo192.png
│   │   ├───📄 logo512.png
│   │   ├───📄 manifest.json
│   │   └───📄 robots.txt
│   ├───📁 src/
│   │   ├───📁 components/
│   │   │   ├───📄 DetailsView.js
│   │   │   ├───📄 ListView.js
│   │   │   └───📄 Navbar.js
│   │   ├───📁 pages/
│   │   │   ├───📄 AddCategory.js
│   │   │   ├───📄 AddItem.js
│   │   │   ├───📄 AddStockMovement.js
│   │   │   ├───📄 AddWarehouse.js
│   │   │   ├───📄 Categories.js
│   │   │   ├───📄 CategoryDetails.js
│   │   │   ├───📄 Homepage.js
│   │   │   ├───📄 ItemDetails.js
│   │   │   ├───📄 Items.js
│   │   │   ├───📄 Stock.js
│   │   │   ├───📄 StockMovement.js
│   │   │   ├───📄 WarehouseDetails.js
│   │   │   └───📄 Warehouses.js
│   │   ├───📄 App.css
│   │   ├───📄 App.js
│   │   ├───📄 App.test.js
│   │   ├───📄 api.js
│   │   ├───📄 index.css
│   │   ├───📄 index.js
│   │   ├───📄 logo.svg
│   │   ├───📄 reportWebVitals.js
│   │   └───📄 setupTests.js
│   ├───📄 .env
│   ├───📄 .gitignore
│   ├───📄 Dockerfile
│   ├───📄 Dockerfile.dev
│   ├───📄 README.md
│   ├───📄 package-lock.json
│   └───📄 package.json
├───📄 .gitignore
├───📄 README.md
├───📄 docker-compose.override.yml
└───📄 docker-compose.yml
```

---

## 🌟 Future Enhancements  
- 🛠 Implement advanced search & filtering  
- 📊 Add inventory reports & analytics  
- ☁️ Cloud deployment (AWS, Azure, etc.)  
- 📱 Optimize UI for mobile accessibility  

---

## 🐝 License  
This project is licensed under the **MIT License**.  

---

🔥 **Efficiently track your equipment with ease!** 🚀

