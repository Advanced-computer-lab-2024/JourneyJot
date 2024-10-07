/** @format */

// src/api.js
import axios from "axios";

const API_URL = "http://localhost:3000"; // Adjust based on your server location

export const fetchTourGuides = async () => {
  const response = await axios.get(`${API_URL}/TourGuide`);
  return response.data;
};

export const createTourGuide = async (guide) => {
  const response = await axios.post(`${API_URL}/TourGuide`, guide);
  return response.data;
};

export const fetchAdvertisers = async () => {
  const response = await axios.get(`${API_URL}/advertisers`);
  return response.data;
};

export const createAdvertiser = async (advertiser) => {
  const response = await axios.post(`${API_URL}/advertisers`, advertiser);
  return response.data;
};

export const fetchItineraries = async () => {
  const response = await axios.get(`${API_URL}/itineraries`);
  return response.data;
};

export const createItinerary = async (itinerary) => {
  const response = await axios.post(`${API_URL}/itineraries`, itinerary);
  return response.data;
};

export const signup = (userData) => {
  return axios.post(`${API_URL}/users/signup`, userData);
};

export const login = (userData) => {
  return axios.post(`${API_URL}/users/login`, userData);
};

export const touristSignup = (userData) => {
  return axios.post(`${API_URL}/tourists/signup`, userData);
};

export const touristLogin = (userData) => {
  return axios.post(`${API_URL}/tourists/login`, userData);
};

export const fetchTourGuideProfile = async () =>
  axios.get(`${API_URL}/tour-guides/profile`);

export const updateTourGuideProfile = async (profile) =>
  axios.put(`${API_URL}/tour-guides/profile`, profile);

export const fetchAdvertiserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/advertisers/profile`); // Adjusted to use axios
    return response.data;
  } catch (error) {
    throw new Error("Error fetching advertiser profile");
  }
};

export const updateAdvertiserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/advertisers/profile`, profileData); // Adjusted to use axios
    return response.data;
  } catch (error) {
    throw new Error("Error updating advertiser profile");
  }
};

// Tourist Profile API Calls
export const fetchTouristProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/tourists/profile`); // Adjusted to use axios
    return response.data;
  } catch (error) {
    throw new Error("Error fetching tourist profile");
  }
};

export const updateTouristProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/tourists/profile`, profileData); // Adjusted to use axios
    return response.data;
  } catch (error) {
    throw new Error("Error updating tourist profile");
  }
};
