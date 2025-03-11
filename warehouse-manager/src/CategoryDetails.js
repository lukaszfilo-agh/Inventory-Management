import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

const CategoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({ name: "" });
    const [items, setItems] = useState([]); // Store category items
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${id}/`);
                setCategory(response.data);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };

        const fetchItems = async () => {
            try {
                const response = await api.get(`/categories/${id}/items/`); // Adjust API endpoint as needed
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching category items:", error);
            }
        };

        fetchCategory();
        fetchItems();
    }, [id]);

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/categories/${id}/`, { name: category.name });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Category Details</h1>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            ) : (
                <div>
                    <h2>{category.name}</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                </div>
            )}
            <h2 className="mt-5">Items</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryDetails;
