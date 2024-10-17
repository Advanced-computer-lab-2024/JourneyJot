/** @format */
import { Routes, Route } from "react-router-dom";
import ShowProducts from "./pages/Products/ShowProducts";
import HomePage from "./pages/General/HomePage";
import AddProduct from "./pages/Products/AddProduct";
import EditProduct from "./pages/Products/EditProduct";
import SignupPage from "./pages/General/SignupPage";
import LoginPage from "./pages/General/LoginPage";
import TouristSignUp from "./pages/Tourist/TouristSignUp";
import TouristLoginPage from "./pages/Tourist/TouristLoginPage";
import TourGuideProfile from "./pages/TourGuide/TourGuideProfile";
import TourismGovernor from "./pages/TourismGoverner/TourismGovernor";
import TouristHomePage from "./pages/Tourist/TouristHomePage.jsx";
import TouristProducts from "./pages/Tourist/TouristProducts.jsx";
import TourGuideDashBoard from "./components/TourGuide/TourGuideDashBoard.jsx";
import Itineraries from "./components/TourGuide/Itineraries.jsx";
import AdvertiserDashBoard from "./components/Advertiser/AdvertiserDashBoard.jsx";
import AdvertiserProfile from "./components/Advertiser/AdvertiserProfile.jsx";
import SellerProfile from "./components/Seller/SellerProfile.jsx";
import SellerDashBoard from "./components/Seller/SellerDashBoard.jsx";
import ActivitiesComponent from "./components/Advertiser/Activities.jsx";
import AdminDashboard from "./components/Admin/AdminDashBoard.jsx";
import AddAdmin from "./components/Admin/AddAdmin.jsx";
import AddGovernor from "./components/Admin/AddGovernor.jsx";
import AdminDeleteUser from "./components/Admin/AdminDeleteUser.jsx";
import CategoryManagement from "./components/Admin/CategoryManagement.jsx";
import PreferenceTagManagement from "./components/Admin/PreferenceTagManagement.jsx";
import TouristProfile from "./components/Tourist/TouristProfile.jsx";
import TouristGuest from "./components/General/TouristGuest.jsx";

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
