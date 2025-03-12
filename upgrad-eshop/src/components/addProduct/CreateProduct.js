import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    manufacturer: "",
    availableItems: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://dev-project-ecommerce.upgrad.dev/api/products/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/products",
        productData,
        {
          headers: { "x-auth-token": `${token}` },
        }
      );

      setSnackbar({
        open: true,
        message: "Product added successfully!",
        severity: "success",
      });

      setTimeout(() => navigate("/AddProduct"), 1500); // Redirect after success
    } catch (error) {
      console.error("Error adding product:", error);
      setSnackbar({
        open: true,
        message: "Failed to add product.",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          name="name"
          fullWidth
          required
          margin="normal"
          value={productData.name}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={productData.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Manufacturer"
          name="manufacturer"
          fullWidth
          required
          margin="normal"
          value={productData.manufacturer}
          onChange={handleChange}
        />
        <TextField
          label="Available Items"
          name="availableItems"
          type="number"
          fullWidth
          required
          margin="normal"
          value={productData.availableItems}
          onChange={handleChange}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          required
          margin="normal"
          value={productData.price}
          onChange={handleChange}
        />
        <TextField
          label="Image URL"
          name="imageUrl"
          fullWidth
          required
          margin="normal"
          value={productData.imageUrl}
          onChange={handleChange}
        />
        <TextField
          label="Product Description"
          name="description"
          fullWidth
          required
          multiline
          rows={4}
          margin="normal"
          value={productData.description}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Product
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateProduct;
