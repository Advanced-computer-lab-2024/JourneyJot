import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/ShowProducts";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ShowProducts />} />
    </Routes>
  );
};

export default App;
