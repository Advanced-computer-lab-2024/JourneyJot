/** @format */
import { Routes, Route } from 'react-router-dom';
import ShowProducts from './pages/Products/ShowProducts';
import HomePage from './pages/General/HomePage';
import AddProduct from './pages/Products/AddProduct';
import EditProduct from './pages/Products/EditProduct';
import SignupPage from './pages/General/SignupPage';
import LoginPage from './pages/General/LoginPage';
import TouristSignUp from './pages/Tourist/TouristSignUp';
import TouristLoginPage from './pages/Tourist/TouristLoginPage';
import TourGuideProfile from './pages/TourGuide/TourGuideProfile';
import TourismGovernor from './pages/TourismGoverner/TourismGovernor';
import TouristHomePage from './pages/Tourist/TouristHomePage.jsx';
import TouristProducts from './pages/Tourist/TouristProducts.jsx';
import TourGuideDashBoard from './components/TourGuide/TourGuideDashBoard.jsx';
import Itineraries from './components/TourGuide/Itineraries.jsx';
import AdvertiserDashBoard from './components/Advertiser/AdvertiserDashBoard.jsx';
import AdvertiserProfile from './components/Advertiser/AdvertiserProfile.jsx';
import SellerProfile from './components/Seller/SellerProfile.jsx';
import SellerDashBoard from './components/Seller/SellerDashBoard.jsx';
import ActivitiesComponent from './components/Advertiser/CreateActivity.jsx';
import AdminDashboard from './components/Admin/AdminDashBoard.jsx';
import AddAdmin from './components/Admin/AddAdmin.jsx';
import AddGovernor from './components/Admin/AddGovernor.jsx';
import AdminDeleteUser from './components/Admin/AdminDeleteUser.jsx';
import CategoryManagement from './components/Admin/CategoryManagement.jsx';
import PreferenceTagManagement from './components/Admin/PreferenceTagManagement.jsx';
import TouristProfile from './components/Tourist/TouristProfile.jsx';
import TouristGuest from './components/General/TouristGuest.jsx';
import ActivitiesPage from './pages/Advertiser/ActivitiesPage.jsx';
import AdminChangePassword from './components/Helper/admin-change-password.jsx';
import TouristChangePassword from './components/Helper/tourist-change-password.jsx';
import AdvertiserChangePassword from './components/Helper/advertiser-change-password.jsx';
import SellerChangePassword from './components/Helper/seller-change-password.jsx';
import TourGuideChangePassword from './components/Helper/tour-guide-change-password.jsx';
import AdminDocumentReview from './components/Admin/AdminDocumentReview.jsx';
import TouristComplaintsPage from './pages/Tourist/Complaints.jsx';
import UserList from './components/Admin/UserList.jsx';
import Flag from './components/Admin/Flag.jsx';
import FullProductPage from './pages/Products/FullProductPage.jsx';
import PurchaseHistory from './pages/Tourist/PurchaseHistory.jsx';
import TouristReservations from './pages/Tourist/TouristReservations.jsx';
import TouristWallet from './pages/Tourist/TouristWallet.jsx';
import TouristPoints from './pages/Tourist/TouristPoints.jsx';
import ProductList from './components/Products/Archieve.jsx';
import AdminComplain from './components/Admin/AdminComplain.jsx';
import ActivityList from './components/Advertiser/ActivityList.jsx';
import CompletedActivityInfo from './pages/Advertiser/CompletedActivityInfo.jsx';
import CompletedItineraryInfo from './pages/TourGuide/CompletedItineraryInfo.jsx';
import TourGuideDetails from './pages/TourGuide/TourGuideDetails.jsx';
import ActivitiesCard from './components/Advertiser/ActivitiesCard.jsx';
import SharedActivityPage from './pages/Advertiser/SharedActivity.jsx';
import SharedItineraryPage from './pages/TourGuide/SharedItinerary.jsx';
import SharedAttractionPage from './pages/TourismGoverner/SharedAttraction.jsx';
import VerifyOTP from './components/ForgetPassword/VerifyOTP.jsx';
import ResetPassword from './components/ForgetPassword/ResetPassword.jsx';
import RequestOTP from './components/ForgetPassword/RequestOTP.jsx';
import GovernorDashBoard from './components/TourismGovernor/GovernorDashboard.jsx';
import ActivityRevenue from './components/Advertiser/ActivityRevenue.jsx';
import ItineraryRevenue from './components/TourGuide/ItineraryRevenue.jsx';
import AttractionRevenue from './components/TourismGovernor/AttractionRevenue.jsx';
import Revenue from './components/Admin/Revenue.jsx';
import ProductRevenue from './components/Seller/ProductRevenue.jsx';
import CreateTransportation from './components/Advertiser/TransportationAdvertiser.jsx';
import FlightOffers from './pages/Tourist/FlightOffers.jsx';
import BookedFlights from './pages/Tourist/BookedFlights.jsx';
import Transportation from './pages/Tourist/Transportations.jsx';
import FlightSearch from './pages/Tourist/FlightSearch.jsx';

import HotelList from './pages/Tourist/HotelList.jsx';
import BookedHotels from './pages/Tourist/BookedHotels.jsx';

import CompletedActivities from './components/Advertiser/CompletedActivities.jsx';
import CompletedItineraries from './components/TourGuide/CompletedItineraries.jsx';
import DisplayNotification from './components/Advertiser/DisplayNotification.jsx';
import DisplayNotificationItinerary from './components/TourGuide/DisplayNotification.jsx';
import SendEmailToAdvertiser from './components/Admin/SendEmailToAdvertiser.jsx';
import SendEmailToTourGuide from './components/Admin/sendEmailToTourGuide.jsx';
import PayActivityWithStripe from './components/Tourist/PayStripeActivity.jsx';
import PayItineraryWithStripe from './components/Tourist/PayStripeItinerary.jsx';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import TouristWishList from './pages/Tourist/TouristWishList.jsx';
import TouristCart from './pages/Tourist/TouristCart.jsx';
import BuyTouristCart from './pages/Tourist/BuyProductCart.jsx';
import AddressManagement from './pages/Tourist/Address.jsx';
import ProductPaymentPage from './components/Tourist/PayStrpeProduct.jsx';
import BuyProductsCardVisa from './components/Tourist/PayStrpeProduct.jsx';
import PreviousPurchases from './pages/Tourist/Orders.jsx';
import NotifyAdminProduct from './components/Admin/NotifyAdminProduct.jsx';
import NotifySellerProduct from './components/Seller/NotifySellerProduct.jsx';
import BookMarks from './pages/Tourist/BookMarks.jsx';
import TouristNotifications from './pages/Tourist/ActivityNotifications.jsx';
import TouristItineraryNotifications from './pages/Tourist/ItineraryNotifications.jsx';
import PromoCodesPage from './pages/Tourist/TouristPromoCode.jsx';
import PromoCodeForm from './components/Admin/AdminPromoCode.jsx';
import ComplaintsAdmin from './components/Admin/AdminComplain.jsx';
import VacationGuide from './components/General/VacationGuide.jsx';
import NetworkNotification from './components/NetworkNotification.jsx';

// Load Stripe with your public key
const stripePromise = loadStripe(
	'pk_test_51QPr8TDbJphsuJ1azF71v68UgZJOXpe5vfeKNpfbNxM7QkVZ3CtaL8MisGPSx9btiOOMQ78G3SvmwvovSMPjx8O900SOrWEaHL'
);

const App = () => {
	return (
		<div>
			{/* Add the NetworkNotification component */}
			<NetworkNotification />
			<Routes>
				<Route
					path='/'
					element={<TouristGuest />}
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
					path='/signup'
					element={<SignupPage />}
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
					path='/tourist/homePage'
					element={<TouristHomePage />}
				/>
				<Route
					path='/tourist/homePage/profile'
					element={<TouristProfile />}
				/>
				<Route
					path='/tourist/homePage/products'
					element={<TouristProducts />}
				/>
				<Route
					path='/tourist/homePage/change-password'
					element={<TouristChangePassword />}
				/>
				<Route
					path='/tourist/homePage/complaints'
					element={<TouristComplaintsPage />}
				/>
				<Route
					path='/tourist/homePage/reservations'
					element={<TouristReservations />}
				/>
				<Route
					path='/tourist/homePage/bookmarks'
					element={<BookMarks />}
				/>
				<Route
					path='/products'
					element={<ShowProducts />}
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
					path='/products/archive'
					element={<ProductList />}
				/>
				<Route
					path='tourist/homePage/products/:id'
					element={<FullProductPage />}
				/>
				<Route
					path='tourist/homePage/products/purchase-history'
					element={<PurchaseHistory />}
				/>
				<Route
					path='tourist/homePage/products/wishlist'
					element={<TouristWishList />}
				/>
				<Route
					path='tourist/homePage/products/cart'
					element={<TouristCart />}
				/>
				<Route
					path='/tour-guide/profile'
					element={<TourGuideProfile />}
				/>
				<Route
					path='/tour-guide-dashboard'
					element={<TourGuideDashBoard />}
				/>
				<Route
					path='/tour-guide-dashboard/profile'
					element={<TourGuideProfile />}
				/>
				<Route
					path='/tour-guide-dashboard/itineraries'
					element={<Itineraries />}
				/>
				<Route
					path='/tour-guide-dashboard/change-password'
					element={<TourGuideChangePassword />}
				/>

				<Route
					path='/admins'
					element={<AdminDashboard />}
				/>
				<Route
					path='/admins/addAdmin'
					element={<AddAdmin />}
				/>
				<Route
					path='/admins/addGovernor'
					element={<AddGovernor />}
				/>
				<Route
					path='/admins/deleteUser'
					element={<AdminDeleteUser />}
				/>
				<Route
					path='/admins/category-management'
					element={<CategoryManagement />}
				/>
				<Route
					path='/admins/preference-tag-management'
					element={<PreferenceTagManagement />}
				/>
				<Route
					path='/admins/change-password'
					element={<AdminChangePassword />}
				/>
				<Route
					path='/admins/admin-account-review'
					element={<AdminDocumentReview />}
				/>
				<Route
					path='/admins/view-users'
					element={<UserList />}
				/>

				<Route
					path='/admins/flag-events'
					element={<Flag />}
				/>
				<Route
					path='/completed'
					element={<ActivityList />}
				/>
				<Route
					path='/completed/activityDetails/:id'
					element={<CompletedActivityInfo />}
				/>
				<Route
					path='/completed/itineraryDetails/:id'
					element={<CompletedItineraryInfo />}
				/>
				<Route
					path='/completed/tourGuideDetails/:id'
					element={<TourGuideDetails />}
				/>
				<Route
					path='/admins/complaints'
					element={<ComplaintsAdmin />}
				/>

				<Route
					path='/tourism-governor'
					element={<TourismGovernor />}
				/>
				<Route
					path='/advertiser-dashboard'
					element={<AdvertiserDashBoard />}
				/>
				<Route
					path='/advertiser-dashboard/profile'
					element={<AdvertiserProfile />}
				/>
				<Route
					path='/advertiser-dashboard/activities'
					element={<ActivitiesComponent />}
				/>
				<Route
					path='/advertiser-dashboard/activities/all-activities'
					element={<ActivitiesPage />}
				/>
				<Route
					path='/advertiser-dashboard/change-password'
					element={<AdvertiserChangePassword />}
				/>
				<Route
					path='/seller-dashboard'
					element={<SellerDashBoard />}
				/>
				<Route
					path='/seller-dashboard/profile'
					element={<SellerProfile />}
				/>
				<Route
					path='/seller-dashboard/change-password'
					element={<SellerChangePassword />}
				/>
				<Route
					path='tourist/homePage/wallet'
					element={<TouristWallet />}
				/>
				<Route
					path='tourist/homePage/points'
					element={<TouristPoints />}
				/>
				<Route
					path='/activities/:id'
					element={<SharedActivityPage />}
				/>
				<Route
					path='/itineraries/:id'
					element={<SharedItineraryPage />}
				/>
				<Route
					path='/attractions/:id'
					element={<SharedAttractionPage />}
				/>
				<Route
					path='/forgot-password'
					element={<RequestOTP />}
				/>
				<Route
					path='/verify-otp'
					element={<VerifyOTP />}
				/>
				<Route
					path='/reset-password'
					element={<ResetPassword />}
				/>
				<Route
					path='/Governor'
					element={<GovernorDashBoard />}
				/>
				<Route
					path='/activity-revenue'
					element={<ActivityRevenue />}
				/>
				<Route
					path='/itinerary-revenue'
					element={<ItineraryRevenue />}
				/>
				<Route
					path='/attraction-revenue'
					element={<AttractionRevenue />}
				/>
				<Route
					path='/product-revenue'
					element={<ProductRevenue />}
				/>
				<Route
					path='/select-revenue'
					element={<Revenue />}
				/>
				<Route
					path='tourist/homePage/transportation'
					element={<Transportation />}
				/>
				<Route
					path='/advertiser-dashboard/transportation'
					element={<CreateTransportation />}
				/>
				<Route
					path='/tourist/homePage/flights'
					element={<FlightSearch />}
				/>
				<Route
					path='/booked-flights'
					element={<BookedFlights />}
				/>
				<Route
					path='/tourist/homePage/hotels'
					element={<HotelList />}
				/>

				<Route
					path='/booked-hotels'
					element={<BookedHotels />}
				/>
				<Route
					path='/count-tourists-activities'
					element={<CompletedActivities />}
				/>
				<Route
					path='/count-tourists-itineraries'
					element={<CompletedItineraries />}
				/>
				<Route
					path='/display-notification-activity'
					element={<DisplayNotification />}
				/>
				<Route
					path='/display-notification-itinerary'
					element={<DisplayNotificationItinerary />}
				/>
				<Route
					path='/mail-advertiser'
					element={<SendEmailToAdvertiser />}
				/>
				<Route
					path='/mail-tour-guide'
					element={<SendEmailToTourGuide />}
				/>
				<Route
					path='/pay-activity-stripe'
					element={
						<Elements stripe={stripePromise}>
							<PayActivityWithStripe />
						</Elements>
					}
				/>
				<Route
					path='/pay-itinerary-stripe'
					element={
						<Elements stripe={stripePromise}>
							<PayItineraryWithStripe />
						</Elements>
					}
				/>
				<Route
					path='/pay-product-stripe'
					element={
						<Elements stripe={stripePromise}>
							<BuyProductsCardVisa />
						</Elements>
					}
				/>
				<Route
					path='/tourist-cart'
					element={<TouristCart />}
				/>
				<Route
					path='/buy-tourist-cart'
					element={<BuyTouristCart />}
				/>
				<Route
					path='/tourist/homePage/hotels'
					element={<HotelList />}
				/>

				<Route
					path='/booked-hotels'
					element={<BookedHotels />}
				/>
				<Route
					path='/tourist-address'
					element={<AddressManagement />}
				/>
				<Route
					path='/tourist-orders'
					element={<PreviousPurchases />}
				/>
				<Route
					path='/notify-seller-product'
					element={<NotifySellerProduct />}
				/>
				<Route
					path='/notify-admin-product'
					element={<NotifyAdminProduct />}
				/>
				<Route
					path='/notify-tourist-activities'
					element={<TouristNotifications />}
				/>
				<Route
					path='/notify-tourist-itineraries'
					element={<TouristItineraryNotifications />}
				/>
				<Route
					path='/tourist/homePage/promo-codes'
					element={<PromoCodesPage />}
				/>
				<Route
					path='/create-promocode'
					element={<PromoCodeForm />}
				/>
				<Route
					path='/step-guide'
					element={<VacationGuide />}
				/>
			</Routes>
		</div>
	);
};

export default App;
