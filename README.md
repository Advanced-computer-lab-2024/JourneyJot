# Virtual Trip Planner

## Table of Contents

- [Project Title](#project-title)
- [Motivation](#motivation)
- [Build Status](#build-status)
- [Code Style](#code-style)
- [Screenshots](#screenshots)
- [Tech/Framework Used](#techframework-used)
- [Features](#features)
- [Code Examples](#code-examples)
- [Installation](#installation)
- [API References](#api-references)
- [Tests](#tests)
- [How to Use](#how-to-use)
- [Contribute](#contribute)
- [Credits](#credits)
- [License](#license)

## Project Title

**Virtual Trip Planner**

## Motivation

The Virtual Trip Planner is designed to simplify vacation planning by providing an all-in-one platform where users can personalize their trips, make seamless bookings, manage budgets, discover local attractions, and receive real-time notifications. Our goal is to enhance the travel experience by integrating essential services into a single, user-friendly application.

## Build Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Code Style

This project follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) to ensure consistency and readability across the codebase. ESLint and Prettier are configured to enforce these standards.

## Screenshots

### Home Page
[![Home Page](./Screenshots/HomePage.png)](./Screenshots/HomePage.png)
*Home Page showcasing featured attractions and itineraries.*

### Admin Page
[![Admin Page](./Screenshots/AdminPage.png)](./Screenshots/AdminPage.png)
*Admin dashboard for managing users, categories, and preferences.*

### Advertiser Page
[![Advertiser Page](./Screenshots/AdvertiserPage.png)](./Screenshots/AdvertiserPage.png)
*Advertiser dashboard for creating and managing activities.*

### Governor Page
[![Governor Page](./Screenshots/GovernorPage.png)](./Screenshots/GovernorPage.png)
*Governor dashboard for managing attractions and viewing revenues.*

### Seller Page
[![Seller Page](./Screenshots/SellerPage.png)](./Screenshots/SellerPage.png)
*Seller dashboard for managing products and viewing product revenue.*

### Tour Guide Page
[![Tour Guide Page](./Screenshots/TourguidePage.png)](./Screenshots/TourguidePage.png)
*Tour Guide dashboard for creating and managing itineraries.*

### Tourist Page
[![Tourist Page](./Screenshots/TouristPage.png)](./Screenshots/TouristPage.png)
*Tourist dashboard for browsing attractions, booking trips, and managing reservations.*

## Tech/Framework Used

- **Frontend:**
  - React.js
  - React Router DOM
  - Tailwind CSS
  - Axios
  - React Icons
  - React Toastify
  - Stripe.js & React Stripe.js

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

- **Testing:**
  - Jest
  - Postman

## Features

### User Roles

- **Tourist:** Browse attractions, book itineraries, manage reservations, view purchase history, and manage wallet and points.
- **Tour Guide:** Create and manage itineraries, view completed itineraries, and manage profile.
- **Advertiser:** Create and manage activities, view activity revenue, and manage profile.
- **Seller:** Manage products, view product revenue, and handle seller-specific notifications.
- **Administrator:** Manage users, categories, preference tags, review documents, handle complaints, and oversee revenue.
- **Governor:** Manage attractions, view attraction revenue, and handle governor-specific notifications.

### Key Functionalities

- **Personalized Travel Planning:** Tailor vacations based on preferences like historic sites, beaches, shopping, and budget.
- **Seamless Booking:** Book flights, hotels, and transportation directly within the app through trusted third-party services.
- **Smart Budgeting:** Receive activity suggestions that fit the remaining budget after booking flights and hotels.
- **Discover Local Gems:** Explore curated activities, museums, and historical landmarks with ticket prices and directions.
- **Real-Time Notifications:** Stay updated on upcoming events and booked activities with instant app and email alerts.
- **Tour Guides Itineraries:** Find expert-guided tours or create customizable itineraries with detailed activity breakdowns.
- **Exclusive Gift Shop:** Access an in-app gift shop for souvenirs and unique local items.
- **Wallet & Points Management:** Manage wallet balance and track points earned through activities and bookings.
- **Admin Controls:** Extensive dashboard for managing users, categories, preferences, and handling revenue reports.

## Code Examples

### Stripe Payment Integration


