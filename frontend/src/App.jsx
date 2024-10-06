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
// eslint-disable-next-line react-hooks/rules-of-hooks

const App = () => {
	return (
		<Routes>
			<Route
				path='/'
				element={<HomePage />}
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
				path='/signup'
				element={<SignupPage />}
			/>
			<Route
				path='/login'
				element={<LoginPage />}
			/>
		</Routes>
	);
};

export default App;
