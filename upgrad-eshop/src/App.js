import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import AddProduct from "./components/addProduct/AddProduct";
import ProductDetails from "./components/productDetails.js/ProductDetails";
import CreateOrder from "./components/createOrder/CreateOrder";
import CreateProduct from "./components/addProduct/CreateProduct";
import EditProduct from "./components/addProduct/EditProduct";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("userRoles") || "[]").includes("ADMIN")
  );

  useEffect(() => {
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
      setIsAdmin(
        JSON.parse(localStorage.getItem("userRoles") || "[]").includes("ADMIN")
      );
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/create-order" element={<CreateOrder />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/product/:productId" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
