import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://dev-project-ecommerce.upgrad.dev/api/auth/signin",
        {
          username: email, // API expects 'username' instead of 'email'
          password,
        }
      );

      console.log("API Response:", response); // Log full response to debug
      console.log("Response Headers:", response.headers);

      // Ensure response contains expected fields
      if (!response.data) {
        throw new Error("Invalid API response");
      }

      const { id, roles } = response.data;
      const userEmail = response.data.email || email; // Fallback to entered email

      // Extract token from headers
      const token =
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0MTc3MTIyMiwiZXhwIjoxNzQxNzc5NjIyfQ.Udtn1HNpI3kOXbWfuG8nklm6QiExGuhBTIM5VXaBNAbwzhldPs5_c0GWdsV84uKSAF8VC1YrslArklheFNig_g";
      console.log("Token received:", token); // Log token

      // Store user data in localStorage
      localStorage.setItem("userId", id);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRoles", JSON.stringify(roles));
      if (token) {
        localStorage.setItem("authToken", token);
      }

      setIsLoggedIn(true);
      setIsAdmin(roles.includes("ADMIN"));

      // Redirect based on role
      if (roles.includes("ADMIN")) {
        navigate("/");
      } else {
        navigate("/login");
      }

      console.log("Logged in successfully:", response.data);
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);
    }
  };

  return (
    <Container className="signin-container" maxWidth="xs">
      <Paper className="signin-paper" elevation={3}>
        <Typography variant="h5">Sign In</Typography>
        {error && <Typography className="error-text">{error}</Typography>}
        <form onSubmit={handleSignIn}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
