import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const steps = ["Product Details", "Address Details", "Confirm Order"];

const CreateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || null; // Get product details from navigation
  const quantity = location.state?.quantity || 1; // Get quantity from navigation

  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [error, setError] = useState("");

  const [newAddress, setNewAddress] = useState({
    name: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    zipcode: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      console.log("token", token);

      const response = await axios.get(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        {
          headers: {
            "x-auth-token": `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      setError("Please select an address!");
      return;
    }
    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const orderData = {
        quantity,
        product: product.id,
        address: selectedAddress,
      };

      await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/orders",
        orderData,
        {
          headers: {
            "x-auth-token": `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Your order is confirmed!");
      navigate("/AddProduct", {
        state: { message: "Order placed successfully!" },
      });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleAddNewAddress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/addresses",
        newAddress,
        {
          headers: {
            "x-auth-token": `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data.id);
      setNewAddress({
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zipcode: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <Container>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && product && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2">
              Category: {product.category}
            </Typography>
            <Typography variant="body2">Price: ${product.price}</Typography>
            <Typography variant="body2">Quantity: {quantity}</Typography>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <div>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Select an Address
          </Typography>
          <Select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {addresses.map((addr) => (
              <MenuItem key={addr.id} value={addr.id}>
                {addr.name}, {addr.street}, {addr.city}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Or Add a New Address
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={newAddress.name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, name: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            value={newAddress.contactNumber}
            onChange={(e) =>
              setNewAddress({ ...newAddress, contactNumber: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Street"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="State"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Landmark"
            value={newAddress.landmark}
            onChange={(e) =>
              setNewAddress({ ...newAddress, landmark: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Zipcode"
            value={newAddress.zipcode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, zipcode: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleAddNewAddress}
          >
            Save Address
          </Button>
        </div>
      )}

      {activeStep === 2 && (
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* Order Details on the Left */}
          <Grid item xs={6}>
            <Typography variant="h6">Confirm Order</Typography>
            <Typography>
              Product: {product?.name} (x{quantity}) <br />
              Price: ${product?.price} <br />
              Category: {product?.category}
            </Typography>
          </Grid>

          {/* Address Details on the Right */}
          <Grid item xs={6}>
            <Typography variant="h6">Shipping Address</Typography>
            {addresses.find((addr) => addr.id === selectedAddress) ? (
              <Typography>
                {addresses.find((addr) => addr.id === selectedAddress).name},{" "}
                <br />
                {
                  addresses.find((addr) => addr.id === selectedAddress).street
                }, <br />
                {
                  addresses.find((addr) => addr.id === selectedAddress).city
                }, <br />
                {
                  addresses.find((addr) => addr.id === selectedAddress).state
                }, <br />
                {addresses.find((addr) => addr.id === selectedAddress).zipcode}
              </Typography>
            ) : (
              <Typography color="error">No address selected</Typography>
            )}
          </Grid>
        </Grid>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <div style={{ marginTop: "20px" }}>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext} sx={{ ml: 2 }}>
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            sx={{ ml: 2 }}
          >
            Confirm Order
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CreateOrder;
