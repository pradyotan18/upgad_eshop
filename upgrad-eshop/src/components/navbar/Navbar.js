import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  Box,
} from "@mui/material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/AddProduct?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        {/* Logo & Title */}
        <ShoppingCart fontSize="large" className="logo" />
        <Typography variant="h6" component={Link} to="/" className="title">
          upGrad Eshop
        </Typography>

        {/* Push everything to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {isLoggedIn ? (
          <>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <InputBase
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Navigation Links with Underline */}
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/AddProduct" className="nav-link">
              Products
            </NavLink>
            {isAdmin && (
              <NavLink to="/create-product" className="nav-link">
                Add Products
              </NavLink>
            )}

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Login & Signup aligned to the right */}

            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/signup" color="inherit">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
