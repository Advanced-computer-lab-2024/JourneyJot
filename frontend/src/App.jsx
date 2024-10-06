import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/ShowProducts";
import HomePage from "./pages/HomePage";
import AddProduct from "./pages/AddProduct";
import AdvertisersPage from "./pages/AdvertisersPage";
import ItinerariesPage from "./pages/ItinerariesPage";
import TourGuidesPage from "./pages/TourGuidesPage";
import EditProduct from "./pages/EditProduct";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ShowProducts />} />
      <Route path="/products/addProduct" element={<AddProduct />} />
      <Route path="/products/editProduct/:id" element={<EditProduct />} />
      <Route path="/TourGuide" element={<TourGuidesPage />} />
      <Route path="/advertisers" element={<AdvertisersPage />} />
      <Route path="/itineraries" element={<ItinerariesPage />} />
    </Routes>
  );
};

export default App;
