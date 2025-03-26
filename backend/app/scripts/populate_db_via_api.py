import requests
from datetime import datetime, timedelta, date

BASE_URL = "http://localhost:8000"  # Update this if your API runs on a different host/port

def populate_db():
    # Create categories
    categories = ["Electronics", "Furniture", "Clothing", "Books", "Toys", "Appliances", "Sports", "Beauty", "Automotive", "Garden"]
    category_ids = []
    for name in categories:
        response = requests.post(f"{BASE_URL}/categories/", json={"name": name})
        response.raise_for_status()
        category_ids.append(response.json()["id"])

    # Create items (10 items per category with real names)
    items = [
        # Electronics
        {"name": "Smartphone", "description": "A high-end smartphone", "category_id": category_ids[0]},
        {"name": "Laptop", "description": "A powerful laptop", "category_id": category_ids[0]},
        {"name": "Tablet", "description": "A lightweight tablet", "category_id": category_ids[0]},
        {"name": "Smartwatch", "description": "A smartwatch with fitness tracking", "category_id": category_ids[0]},
        {"name": "Headphones", "description": "Noise-cancelling headphones", "category_id": category_ids[0]},
        {"name": "Camera", "description": "A DSLR camera", "category_id": category_ids[0]},
        {"name": "TV", "description": "A 4K Ultra HD TV", "category_id": category_ids[0]},
        {"name": "Gaming Console", "description": "A next-gen gaming console", "category_id": category_ids[0]},
        {"name": "Router", "description": "A high-speed Wi-Fi router", "category_id": category_ids[0]},
        {"name": "External Hard Drive", "description": "A 1TB external hard drive", "category_id": category_ids[0]},

        # Furniture
        {"name": "Sofa", "description": "A comfortable 3-seater sofa", "category_id": category_ids[1]},
        {"name": "Dining Table", "description": "A wooden dining table", "category_id": category_ids[1]},
        {"name": "Office Chair", "description": "An ergonomic office chair", "category_id": category_ids[1]},
        {"name": "Bed Frame", "description": "A king-size bed frame", "category_id": category_ids[1]},
        {"name": "Bookshelf", "description": "A tall wooden bookshelf", "category_id": category_ids[1]},
        {"name": "Coffee Table", "description": "A glass-top coffee table", "category_id": category_ids[1]},
        {"name": "Wardrobe", "description": "A spacious wardrobe", "category_id": category_ids[1]},
        {"name": "TV Stand", "description": "A modern TV stand", "category_id": category_ids[1]},
        {"name": "Recliner", "description": "A leather recliner", "category_id": category_ids[1]},
        {"name": "Bar Stool", "description": "A set of bar stools", "category_id": category_ids[1]},

        # Clothing
        {"name": "T-shirt", "description": "A cotton t-shirt", "category_id": category_ids[2]},
        {"name": "Jeans", "description": "A pair of denim jeans", "category_id": category_ids[2]},
        {"name": "Jacket", "description": "A warm winter jacket", "category_id": category_ids[2]},
        {"name": "Sweater", "description": "A woolen sweater", "category_id": category_ids[2]},
        {"name": "Dress", "description": "A stylish evening dress", "category_id": category_ids[2]},
        {"name": "Shorts", "description": "A pair of casual shorts", "category_id": category_ids[2]},
        {"name": "Shirt", "description": "A formal shirt", "category_id": category_ids[2]},
        {"name": "Skirt", "description": "A knee-length skirt", "category_id": category_ids[2]},
        {"name": "Blazer", "description": "A tailored blazer", "category_id": category_ids[2]},
        {"name": "Sneakers", "description": "A pair of running sneakers", "category_id": category_ids[2]},

        # Books
        {"name": "Mystery Novel", "description": "A thrilling mystery novel", "category_id": category_ids[3]},
        {"name": "Science Fiction", "description": "A futuristic sci-fi book", "category_id": category_ids[3]},
        {"name": "Biography", "description": "An inspiring biography", "category_id": category_ids[3]},
        {"name": "Cookbook", "description": "A cookbook with delicious recipes", "category_id": category_ids[3]},
        {"name": "Children's Book", "description": "A fun book for kids", "category_id": category_ids[3]},
        {"name": "Fantasy Novel", "description": "A magical fantasy story", "category_id": category_ids[3]},
        {"name": "History Book", "description": "A detailed history book", "category_id": category_ids[3]},
        {"name": "Self-Help Book", "description": "A motivational self-help book", "category_id": category_ids[3]},
        {"name": "Travel Guide", "description": "A guide to popular destinations", "category_id": category_ids[3]},
        {"name": "Poetry Collection", "description": "A collection of poems", "category_id": category_ids[3]},

        # Toys
        {"name": "Action Figure", "description": "A superhero action figure", "category_id": category_ids[4]},
        {"name": "Doll", "description": "A beautiful doll", "category_id": category_ids[4]},
        {"name": "Puzzle", "description": "A challenging puzzle", "category_id": category_ids[4]},
        {"name": "Board Game", "description": "A fun board game", "category_id": category_ids[4]},
        {"name": "Lego Set", "description": "A creative Lego set", "category_id": category_ids[4]},
        {"name": "Toy Car", "description": "A remote-controlled car", "category_id": category_ids[4]},
        {"name": "Stuffed Animal", "description": "A cuddly stuffed animal", "category_id": category_ids[4]},
        {"name": "Building Blocks", "description": "Colorful building blocks", "category_id": category_ids[4]},
        {"name": "Yo-Yo", "description": "A classic yo-yo", "category_id": category_ids[4]},
        {"name": "Kite", "description": "A colorful kite", "category_id": category_ids[4]},

        # Appliances
        {"name": "Refrigerator", "description": "A double-door refrigerator", "category_id": category_ids[5]},
        {"name": "Washing Machine", "description": "A front-load washing machine", "category_id": category_ids[5]},
        {"name": "Microwave Oven", "description": "A microwave oven with grill", "category_id": category_ids[5]},
        {"name": "Dishwasher", "description": "A high-efficiency dishwasher", "category_id": category_ids[5]},
        {"name": "Air Conditioner", "description": "A split air conditioner", "category_id": category_ids[5]},
        {"name": "Vacuum Cleaner", "description": "A powerful vacuum cleaner", "category_id": category_ids[5]},
        {"name": "Blender", "description": "A high-speed blender", "category_id": category_ids[5]},
        {"name": "Toaster", "description": "A 4-slice toaster", "category_id": category_ids[5]},
        {"name": "Coffee Maker", "description": "An espresso coffee maker", "category_id": category_ids[5]},
        {"name": "Electric Kettle", "description": "A stainless steel electric kettle", "category_id": category_ids[5]},

        # Sports
        {"name": "Football", "description": "A professional football", "category_id": category_ids[6]},
        {"name": "Basketball", "description": "An official size basketball", "category_id": category_ids[6]},
        {"name": "Tennis Racket", "description": "A lightweight tennis racket", "category_id": category_ids[6]},
        {"name": "Yoga Mat", "description": "A non-slip yoga mat", "category_id": category_ids[6]},
        {"name": "Dumbbells", "description": "A set of adjustable dumbbells", "category_id": category_ids[6]},
        {"name": "Treadmill", "description": "A foldable treadmill", "category_id": category_ids[6]},
        {"name": "Bicycle", "description": "A mountain bike", "category_id": category_ids[6]},
        {"name": "Golf Clubs", "description": "A set of golf clubs", "category_id": category_ids[6]},
        {"name": "Swimming Goggles", "description": "Anti-fog swimming goggles", "category_id": category_ids[6]},
        {"name": "Baseball Glove", "description": "A leather baseball glove", "category_id": category_ids[6]},

        # Beauty
        {"name": "Lipstick", "description": "A long-lasting lipstick", "category_id": category_ids[7]},
        {"name": "Foundation", "description": "A liquid foundation", "category_id": category_ids[7]},
        {"name": "Mascara", "description": "A waterproof mascara", "category_id": category_ids[7]},
        {"name": "Perfume", "description": "A floral perfume", "category_id": category_ids[7]},
        {"name": "Face Cream", "description": "A hydrating face cream", "category_id": category_ids[7]},
        {"name": "Shampoo", "description": "A sulfate-free shampoo", "category_id": category_ids[7]},
        {"name": "Conditioner", "description": "A nourishing conditioner", "category_id": category_ids[7]},
        {"name": "Body Lotion", "description": "A moisturizing body lotion", "category_id": category_ids[7]},
        {"name": "Nail Polish", "description": "A quick-dry nail polish", "category_id": category_ids[7]},
        {"name": "Hair Dryer", "description": "A professional hair dryer", "category_id": category_ids[7]},

        # Automotive
        {"name": "Car Battery", "description": "A high-performance car battery", "category_id": category_ids[8]},
        {"name": "Tire", "description": "An all-season tire", "category_id": category_ids[8]},
        {"name": "Engine Oil", "description": "A synthetic engine oil", "category_id": category_ids[8]},
        {"name": "Car Wash Kit", "description": "A complete car wash kit", "category_id": category_ids[8]},
        {"name": "GPS Navigator", "description": "A GPS navigation system", "category_id": category_ids[8]},
        {"name": "Car Cover", "description": "A waterproof car cover", "category_id": category_ids[8]},
        {"name": "Jump Starter", "description": "A portable jump starter", "category_id": category_ids[8]},
        {"name": "Air Compressor", "description": "A digital air compressor", "category_id": category_ids[8]},
        {"name": "Car Vacuum", "description": "A handheld car vacuum", "category_id": category_ids[8]},
        {"name": "Dash Cam", "description": "A high-definition dash cam", "category_id": category_ids[8]},

        # Garden
        {"name": "Lawn Mower", "description": "A self-propelled lawn mower", "category_id": category_ids[9]},
        {"name": "Garden Hose", "description": "A flexible garden hose", "category_id": category_ids[9]},
        {"name": "Pruning Shears", "description": "A pair of pruning shears", "category_id": category_ids[9]},
        {"name": "Garden Trowel", "description": "A stainless steel garden trowel", "category_id": category_ids[9]},
        {"name": "Watering Can", "description": "A large watering can", "category_id": category_ids[9]},
        {"name": "Garden Gloves", "description": "A pair of garden gloves", "category_id": category_ids[9]},
        {"name": "Wheelbarrow", "description": "A heavy-duty wheelbarrow", "category_id": category_ids[9]},
        {"name": "Garden Fork", "description": "A durable garden fork", "category_id": category_ids[9]},
        {"name": "Compost Bin", "description": "A compost bin with lid", "category_id": category_ids[9]},
        {"name": "Garden Rake", "description": "A metal garden rake", "category_id": category_ids[9]},
    ]
    item_ids = []
    for item in items:
        response = requests.post(f"{BASE_URL}/items/", json=item)
        response.raise_for_status()
        item_ids.append(response.json()["id"])

    # Create warehouses
    warehouses = [
        {"name": "Main Warehouse", "location": "New York"},
        {"name": "Secondary Warehouse", "location": "Los Angeles"},
        {"name": "East Coast Warehouse", "location": "Boston"},
        {"name": "West Coast Warehouse", "location": "San Francisco"},
        {"name": "Central Warehouse", "location": "Chicago"},
    ]
    warehouse_ids = []
    for warehouse in warehouses:
        response = requests.post(f"{BASE_URL}/warehouses/", json=warehouse)
        response.raise_for_status()
        warehouse_ids.append(response.json()["id"])

    # Create stock movements (at least 20 per item: inflows first, then outflows)
    stock_movements = []
    for item_id in item_ids:
        # Add 10 inflows
        for k in range(10):
            stock_movements.append({
                "item_id": item_id,
                "warehouse_id": warehouse_ids[k % len(warehouse_ids)],
                "movement_type": "inflow",
                "quantity": 10 + k,
                "movement_date": (date.today() - timedelta(days=k + 1)).isoformat(),
                "price": 50.0 + k * 5
            })
        # Add 10 outflows
        for k in range(10):
            stock_movements.append({
                "item_id": item_id,
                "warehouse_id": warehouse_ids[k % len(warehouse_ids)],
                "movement_type": "outflow",
                "quantity": 5 + k,
                "movement_date": (date.today() - timedelta(days=k + 11)).isoformat(),
                "price": 50.0 + k * 5
            })
    for movement in stock_movements:
        response = requests.post(f"{BASE_URL}/stock/movement/add", json=movement)
        response.raise_for_status()

    print("Database populated successfully via API!")

if __name__ == "__main__":
    populate_db()
