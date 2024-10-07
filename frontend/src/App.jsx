/** @format */
import { Routes, Route } from 'react-router-dom';
import ShowProducts from './pages/ShowProducts';
import HomePage from './pages/HomePage';
import AddProduct from './pages/AddProduct';
import AdvertisersPage from './pages/AdvertisersPage';
import ItinerariesPage from './pages/ItinerariesPage';
import TourGuidesPage from './pages/TourGuidesPage';
import EditProduct from './pages/EditProduct';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Admins from './pages/Admins';
import TouristSignUp from './pages/TouristSignUp';
import TouristLoginPage from './pages/TouristLoginPage';
import TourGuideProfile from './pages/TourGuideProfile';
import Dashboard from './components/DashBoard';
// eslint-disable-next-line react-hooks/rules-of-hooks

// /** @format */

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Adjust the path if necessary

// const App = () => {
// 	return (
// 		<Router>
// 			<Routes>
// 				<Route path="/dashboard/*" element={<Dashboard />} />
// 				{/* You can add other routes here if needed */}
// 			</Routes>
// 		</Router>
// 	);
// };

// export default App;

const App = () => {
	return (
		<Routes>
			<Route
				path='/'
				element={<SignupPage />}
			/>
			<Route
				path='/home-page'
				element={<HomePage />}
			/>
			<Route
				path='/login'
				element={<LoginPage />}
			/>
			<Route
				path='/Tourist-Signup'
				element={<TouristSignUp />}
			/>
			<Route
				path='/tourist-Login'
				element={<TouristLoginPage />}
			/>
			<Route
				path='/products'
				element={<ShowProducts />}
			/>
			<Route
				path='/admins'
				element={<Admins />}
			/>
			<Route
				path='/products/addProduct'
				element={<AddProduct />}
			/>
			<Route
				path='/products/editProduct/:id'
				element={<EditProduct />}
			/>
			<Route
				path='/TourGuide'
				element={<TourGuidesPage />}
			/>
			<Route
				path='/advertisers'
				element={<AdvertisersPage />}
			/>
			<Route
				path='/itineraries'
				element={<ItinerariesPage />}
			/>
			<Route
				path='/tour-guide/profile'
				element={<TourGuideProfile />}
			/>
			<Route
				path='/dashboard/*'
				element={<Dashboard />}
			/>
		</Routes>
	);
};

export default App;
