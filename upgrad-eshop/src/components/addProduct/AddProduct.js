import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const AddProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const userRole = JSON.parse(localStorage.getItem("userRoles")) || [];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  useEffect(() => {
    fetchCategories();
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://dev-project-ecommerce.upgrad.dev/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory) {
      setSelectedCategory(newCategory);
    }
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleBuyNow = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleEdit = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return; // If user cancels, do nothing

    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
      console.log("token", token);

      await axios.delete(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${productId}`,
        {
          headers: {
            "x-auth-token": `${token}`, // Include token in headers
          },
        }
      );

      setProducts(products.filter((product) => product.id !== productId));
      console.log(`Product ${productId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts] // Use filteredProducts instead of products
    .filter((product) =>
      selectedCategory === "all" ? true : product.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "priceHigh") return b.price - a.price;
      if (sortOrder === "priceLow") return a.price - b.price;
      if (sortOrder === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <Container>
      <ToggleButtonGroup
        value={selectedCategory}
        exclusive
        onChange={handleCategoryChange}
        aria-label="product categories"
      >
        <ToggleButton value="all">All</ToggleButton>
        {categories.map((category) => (
          <ToggleButton key={category} value={category}>
            {category}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Select
        value={sortOrder}
        onChange={handleSortChange}
        sx={{ ml: 2, mb: 2 }}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="priceHigh">Price: High to Low</MenuItem>
        <MenuItem value="priceLow">Price: Low to High</MenuItem>
        <MenuItem value="newest">Newest</MenuItem>
      </Select>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBuyNow(product.id)}
                  >
                    Buy Now
                  </Button>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product.id)}
                    sx={{ ml: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product.id)}
                    sx={{ ml: 1 }}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AddProduct;
