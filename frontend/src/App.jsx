import React from "react";
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/ShowProducts";
import HomePage from "./pages/HomePage";
import AddProduct from "./pages/AddProduct";
import AdvertisersPage from "./pages/AdvertisersPage";
import TourGuidesPage from "./pages/CreateTourGuidePage";
import TourGuideListPage from "./pages/TourGuideListPage";
import ItineraryPage from './pages/ItineraryPage';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ShowProducts />} />
      <Route path="/tourGuides" element={<TourGuideListPage />} />
      <Route path="/advertisers" element={<AdvertisersPage />} />
      <Route path="/itinerary" element={<ItineraryPage />} />
    </Routes>
  );
};


export default App;
