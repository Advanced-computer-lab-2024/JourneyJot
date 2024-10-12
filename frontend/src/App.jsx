/** @format */
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/ShowProducts";
import HomePage from "./pages/HomePage";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
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
import ActivitiesComponent from "./components/Activities.jsx";
import AdminDashboard from "./components/AdminDashBoard.jsx";
import AddAdmin from "./components/AddAdmin.jsx";
import AddGovernor from "./components/AddGovernor.jsx";
import AdminDeleteUser from "./components/AdminDeleteUser.jsx";
import CategoryManagement from "./components/CategoryManagement.jsx";
import PreferenceTagManagement from "./components/PreferenceTagManagement.jsx";
import TouristHomePage from "./pages/TouristHomePage.jsx";
import TouristProfile from "./components/TouristProfile.jsx";
import TouristGuest from "./components/TouristGuest.jsx";
import TouristProducts from "./pages/TouristProducts.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TouristGuest />} />
      <Route path="/home-page" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/Tourist-Signup" element={<TouristSignUp />} />
      <Route path="/tourist-Login" element={<TouristLoginPage />} />
      <Route path="/tourist/homePage" element={<TouristHomePage />} />
      <Route path="/tourist/homePage/profile" element={<TouristProfile />} />
      <Route path="/tourist/homePage/products" element={<TouristProducts />} />
      <Route path="/products" element={<ShowProducts />} />
      <Route path="/products/addProduct" element={<AddProduct />} />
      <Route path="/products/editProduct/:id" element={<EditProduct />} />
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
      <Route path="/admins" element={<AdminDashboard />} />
      <Route path="/admins/addAdmin" element={<AddAdmin />} />
      <Route path="/admins/addGovernor" element={<AddGovernor />} />
      <Route path="/admins/deleteUser" element={<AdminDeleteUser />} />
      <Route
        path="/admins/category-management"
        element={<CategoryManagement />}
      />
      <Route
        path="/admins/preference-tag-management"
        element={<PreferenceTagManagement />}
      />
      <Route path="/tourism-governor" element={<TourismGovernor />} />
      <Route path="/advertiser-dashboard" element={<AdvertiserDashBoard />} />
      <Route
        path="/advertiser-dashboard/profile"
        element={<AdvertiserProfile />}
      />
      <Route
        path="/advertiser-dashboard/activities"
        element={<ActivitiesComponent />}
      />
      <Route path="/seller-dashboard" element={<SellerDashBoard />} />
      <Route path="/seller-dashboard/profile" element={<SellerProfile />} />
    </Routes>
  );
};

export default App;
