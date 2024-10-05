import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/ShowProducts";
import HomePage from "./pages/HomePage";
import AddProduct from "./pages/AddProduct";
import AdvertisersPage from "./pages/AdvertisersPage";
import ItinerariesPage from "./pages/ItinerariesPage";
import TourGuidesPage from "./pages/CreateTourGuidePage";



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ShowProducts />} />
      <Route path="/TourGuide" element ={<TourGuidesPage/>} />
      <Route path="/advertisers" elemnet ={<AdvertisersPage/>} />
      <Route path="/itineraries" element ={<ItinerariesPage/>} />
    </Routes>
  );
};

export default App;
