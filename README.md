# 📦 Inventory Management System  

This is a full-stack **Inventory Management System** built using **FastAPI**, **SQLAlchemy**, and a **React frontend** with **Bootstrap 5** for styling. It allows users to manage warehouses and track items stored within them.  

---

## 🚀 Features  

- ✅ Create and manage warehouses  
- ✅ Add, edit, and delete items stored in warehouses  
- ✅ View items categorized by warehouse  
- ✅ RESTful API built with FastAPI  
- ✅ SQLite database using SQLAlchemy ORM  
- ✅ React frontend styled with Bootstrap 5  
- ✅ User-friendly interface with real-time updates  

---

## 🛠 Installation  

### 🔹 Backend Setup (FastAPI + SQLite)  

#### 1️⃣ Prerequisites  
- Python 3.8+  
- FastAPI  
- SQLAlchemy  
- Pydantic  
- Uvicorn  

#### 2️⃣ Clone the repository  
```sh
git clone https://github.com/lukaszfilo-agh/Inventory-Management
cd inventory-management/api
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

## 🔗 API Endpoints  

### 📦 Warehouse Endpoints  
**List All Warehouses**  
- `GET /warehouses/`  

**Create a Warehouse**  
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

### 📋 Item Endpoints  
**List All Items**  
- `GET /items/`  

**Create an Item**  
- `POST /items/`  
- **Request Body:**  
  ```json
  {
    "name": "Laptop",
    "quantity": 10,
    "date_added": "2025-03-10",
    "price": 1200.50,
    "warehouse_id": 1
  }
  ```
- **Response:**  
  ```json
  {
    "id": 1,
    "name": "Laptop",
    "quantity": 10,
    "date_added": "2025-03-10",
    "price": 1200.50,
    "warehouse_id": 1
  }
  ```

**Delete an Item**  
- `DELETE /items/{item_id}`  

---

## 🗄 Database Structure  
- Uses **SQLite** (`inventory.db`)  
- **Tables:**  
  - `warehouses`: Stores warehouse details  
  - `items`: Stores inventory items linked to a warehouse  

---

## 🎨 Frontend Overview  

### 📌 Navigation  
- 🏠 **Home**: Displays all items categorized by warehouse  
- ➕ **Add Item**: Allows adding new inventory items  
- 🏢 **Warehouses**: Lists all warehouses  

### 🎨 Styling  
- The React UI is **fully styled with Bootstrap 5**  
- Responsive design for mobile & desktop  
- Clear tables and forms for easy data management  

---

## 🔮 Future Enhancements  
- 🔒 Implement authentication & user roles  
- 📊 Add warehouse statistics & reports  
- ☁️ Deploy the app to a cloud service (AWS, Azure, etc.)  
- 📱 Improve mobile UI for better accessibility  

---

## 📜 License  
This project is licensed under the **MIT License**.  

---

🔥 **Enjoy managing your inventory with ease!** 🚀  
