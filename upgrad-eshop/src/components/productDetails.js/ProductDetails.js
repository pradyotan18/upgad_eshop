import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://dev-project-ecommerce.upgrad.dev/api/products/${id}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 1); // Ensure at least 1
    setQuantity(value);
  };

  if (loading) return <Typography>Loading product details...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Container>
      <Card sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
        <CardMedia
          component="img"
          height="300"
          image={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.name || "Product image not available"}
        />
        <CardContent>
          <Typography variant="h5">{product.name}</Typography>
          <Typography variant="body1" color="textSecondary">
            {product.description || "No description available"}
          </Typography>
          {/* Display Category */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Category: <strong>{product.category || "Not specified"}</strong>
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Price: ${product.price}
          </Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            sx={{ mt: 2, width: "100px" }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, ml: 2 }}
            onClick={() =>
              navigate("/create-order", {
                state: {
                  product,
                  quantity,
                  category: product.category,
                  price: product.price,
                },
              })
            }
          >
            Place Order
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;
