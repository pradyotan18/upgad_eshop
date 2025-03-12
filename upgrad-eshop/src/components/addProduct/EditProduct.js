import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography } from "@mui/material";

const EditProduct = () => {
  const { productId } = useParams(); // Get productId from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    manufacturer: "",
    availableItems: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${productId}`
      );
      setProduct(response.data); // Preload form with product details
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token
      await axios.put(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${productId}`,
        product,
        {
          headers: { "x-auth-token": token },
        }
      );
      alert("Product updated successfully");
      navigate("/AddProduct"); // Redirect after update
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5">Edit Product</Typography>
      <form onSubmit={handleUpdate}>
        <TextField
          label="Name"
          name="name"
          value={product.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Manufacturer"
          name="manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Available Items"
          name="availableItems"
          value={product.availableItems}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Price"
          name="price"
          value={product.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Image URL"
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Update Product
        </Button>
      </form>
    </Container>
  );
};

export default EditProduct;
