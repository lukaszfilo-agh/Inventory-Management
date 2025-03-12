# 📦 Inventory Management System  

This is a full-stack **Inventory Management System** built using **FastAPI**, **SQLAlchemy**, and a **React frontend** with **Bootstrap 5** for styling. It allows users to manage warehouses and track items stored within them. It also supports **Docker** for containerized deployment and uses **PostgreSQL** as the database.

---

## 🚀 Features  

- ✅ Create and manage warehouses  
- ✅ Add, edit, and delete items stored in warehouses  
- ✅ View items categorized by warehouse  
- ✅ RESTful API built with FastAPI  
- ✅ PostgreSQL database using SQLAlchemy ORM  
- ✅ React frontend styled with Bootstrap 5  
- ✅ User-friendly interface with real-time updates  
- ✅ Docker support for easy deployment  

---

## 🛠 Installation  

### 🔹 Backend Setup (FastAPI + PostgreSQL)  

#### 1⃣ Prerequisites  
- Python 3.12.9+  
- FastAPI 0.1.0  
- SQLAlchemy  
- Pydantic  
- Uvicorn  
- PostgreSQL  
- Docker & Docker Compose (for containerized setup)  

#### 2⃣ Clone the repository  
```sh
git clone https://github.com/lukaszfilo-agh/Inventory-Management
cd inventory-management/api
```

#### 3⃣ Install dependencies  
```sh
pip install -r requirements.txt
```

#### 4⃣ Run the FastAPI server  
```sh
uvicorn main:app --reload
```

🔹 The API server will run at `http://127.0.0.1:8000/docs` (for interactive API documentation).  

---

### 🔹 Frontend Setup (React + Bootstrap 5)  

#### 1⃣ Prerequisites  
- Node.js 14+  
- npm or yarn  

#### 2⃣ Navigate to the frontend directory  
```sh
cd ../warehouse-manager
```

#### 3⃣ Install dependencies  
```sh
npm install
```

#### 4⃣ Start the React app  
```sh
npm start
```

🔹 The React app will run at `http://localhost:3000/`.

---

## 💪 Docker Setup  

### Running the App with Docker Compose  

#### 1⃣ Ensure Docker and Docker Compose are installed  
#### 2⃣ Navigate to the project root directory and run:  
```sh
docker-compose up --build
```

This will start the **FastAPI backend**, **React frontend**, and **PostgreSQL database** in Docker containers.  

#### 3⃣ Stop the application  
```sh
docker-compose down
```

---

## 🔗 API Endpoints  

### 📦 Warehouse Endpoints  
- `GET /health` - Health Check  
- `GET /warehouses/` - Get Warehouses  
- `POST /warehouses/` - Create Warehouse  
- `GET /warehouses/{warehouse_id}` - Get Warehouse  
- `PATCH /warehouses/{warehouse_id}` - Update Warehouse  
- `DELETE /warehouses/{warehouse_id}` - Delete Warehouse  
- `GET /warehouses/{warehouse_id}/items` - Get Warehouse Items  

### 📋 Category Endpoints  
- `GET /categories/` - Get Categories  
- `POST /categories/` - Create Category  
- `GET /categories/{category_id}` - Get Category  
- `PATCH /categories/{category_id}` - Update Category  
- `GET /categories/{category_id}/items` - Get Category Items  

### 📚 Item Endpoints  
- `GET /items/` - Get Items  
- `POST /items/` - Create Item  
- `GET /items/{item_id}` - Get Item  
- `DELETE /items/{item_id}` - Delete Item  

---

## 🛂 Folder Structure  
```
inventory-management/
│── api/  # FastAPI backend
│   ├── main.py  # Entry point
│   ├── models.py  # Database models
│   ├── routers/  # API routes
│   ├── database.py  # Database connection setup
│   ├── schemas.py  # Pydantic models
│   ├── requirements.txt  # Python dependencies
│── warehouse-manager/  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json  # Frontend dependencies
│── docker-compose.yml  # Docker setup
│── .env  # Environment variables
```

---

## 🌐 Future Enhancements  
- 🔒 Implement authentication & user roles  
- 📊 Add warehouse statistics & reports  
- ☁️ Deploy the app to a cloud service (AWS, Azure, etc.)  
- 📱 Improve mobile UI for better accessibility  

---

## 🐝 License  
This project is licensed under the **MIT License**.  

---

🔥 **Enjoy managing your inventory with ease!** 🚀
