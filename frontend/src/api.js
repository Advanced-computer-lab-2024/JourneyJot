// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Adjust based on your server location


export const fetchTourGuides = async () => {
  const response = await axios.get(`${API_URL}/tourGuides`);
  return response.data;
};

export const createTourGuide = async (guide) => {
  const response = await axios.post(`${API_URL}/tourGuides/create`, guide);
  return response.data;
};

export const fetchTourGuideById = async (id) => {
  const response = await axios.get(`${API_URL}/tourGuides/${id}`);
  return response.data;
};

export const updateTourGuide = async (id, guide) => {
  const response = await axios.put(`${API_URL}/tourGuides/${id}`, guide);
  return response.data;
};




export const fetchAdvertisers = async () => {
  const response = await axios.get(`${API_URL}/advertisers`);
  return response.data;
};

export const createAdvertiser = async (advertiser) => {
  const response = await axios.post(`${API_URL}/advertisers/create`, advertiser);
  return response.data;
};

export const fetchAdvertiserById = async (id) => {
  const response = await axios.get(`${API_URL}/advertisers/${id}`);
  return response.data;
};

export const updateAdvertiser = async (id, advertiser) => {
  const response = await axios.put(`${API_URL}/advertisers/${id}`, advertiser);
  return response.data;
};

export const fetchItineraries = async () => {
  const response = await axios.get(`${API_URL}/itineraries`);
  return response.data;
};

export const createItinerary = async (itinerary) => {
  const response = await axios.post(`${API_URL}/itineraries/create`, itinerary);
  return response.data;
};

export const updateItinerary = async (id, itinerary) => {
  const response = await axios.put(`${API_URL}/itineraries/${id}`, itinerary);
  return response.data;
};

export const deleteItinerary = async (id) => {
  await axios.delete(`${API_URL}/itineraries/${id}`);
};






