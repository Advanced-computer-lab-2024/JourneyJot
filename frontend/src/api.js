// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Adjust based on your server location

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