/** @format */
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/ShowProducts";
import HomePage from "./pages/HomePage";
import AddProduct from "./pages/AddProduct";
import AdvertisersPage from "./pages/AdvertisersPage";
import ItinerariesPage from "./pages/ItinerariesPage";
import TourGuidesPage from "./pages/TourGuidesPage";
import EditProduct from "./pages/EditProduct";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Admins from "./pages/Admins";
import TouristSignUp from "./pages/TouristSignUp";
import TouristLoginPage from "./pages/TouristLoginPage";
import TourGuideProfile from "./pages/TourGuideProfile";
import TourGuideDashBoard from "./components/TourGuideDashBoard.jsx";
import TourismGovernor from "./pages/TourismGovernor.jsx";
import Itineraries from "./components/Itineraries.jsx";
import AdvertiserDashBoard from "./components/AdvertiserDashBoard.jsx";
import AdvertiserProfile from "./components/AdvertiserProfile.jsx";
import SellerProfile from "./components/SellerProfile.jsx";
import SellerDashBoard from "./components/SellerDashBoard.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/home-page" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/Tourist-Signup" element={<TouristSignUp />} />
      <Route path="/tourist-Login" element={<TouristLoginPage />} />
      <Route path="/products" element={<ShowProducts />} />
      <Route path="/admins" element={<Admins />} />
      <Route path="/products/addProduct" element={<AddProduct />} />
      <Route path="/products/editProduct/:id" element={<EditProduct />} />
      <Route path="/TourGuide" element={<TourGuidesPage />} />
      <Route path="/advertisers" element={<AdvertisersPage />} />
      <Route path="/itineraries" element={<ItinerariesPage />} />
      <Route path="/tour-guide/profile" element={<TourGuideProfile />} />
      <Route path="/tour-guide-dashboard" element={<TourGuideDashBoard />} />
      <Route
        path="/tour-guide-dashboard/profile"
        element={<TourGuideProfile />}
      />
      <Route
        path="/tour-guide-dashboard/itineraries"
        element={<Itineraries />}
      />
      <Route path="/tourism-governor" element={<TourismGovernor />} />
      <Route path="/advertiser-dashboard" element={<AdvertiserDashBoard />} />
      <Route
        path="/advertiser-dashboard/profile"
        element={<AdvertiserProfile />}
      />
      <Route path="/seller-dashboard" element={<SellerDashBoard />} />
      <Route path="/seller-dashboard/profile" element={<SellerProfile />} />
    </Routes>
  );
};

export default App;
