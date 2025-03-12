import React, { useState, useEffect } from "react";
import api from "../api";

const AddCategory = () => {
    const [newCategory, setNewCategory] = useState({
        name: ""
    });

    const [addedCategory, setAddedCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddCategory = async () => {
        try {
            const response = await api.post("/categories/", newCategory);
            setAddedCategory(response.data);
            setNewCategory({
                name: ""
            });
            setErrorMessage("");
        } catch (error) {
            console.error("Error adding category:", error);
            setErrorMessage("Failed to add category. Please try again.");
        }
    };

    const handleChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Add Category</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm">
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Category Name</label>
                                <input name="name" id="name" className="form-control" value={newCategory.name} onChange={handleChange} placeholder="Enter category name" />
                            </div>
                            <button className="btn btn-primary" onClick={handleAddCategory}>Add Category</button>
                            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                            {addedCategory && <div className="alert alert-success mt-3">Category added successfully!</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;