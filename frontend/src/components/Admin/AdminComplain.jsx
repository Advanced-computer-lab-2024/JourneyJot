/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintsAdmin = () => {
	const [complaints, setComplaints] = useState([]);
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [reply, setReply] = useState('');
	const [status, setStatus] = useState('');
	const [sortOrder, setSortOrder] = useState('desc');
	const token = localStorage.getItem('token');

	// Function to get all complaints with sort and filter
	const fetchComplaints = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/complaints/filter/sort?sortOrder=${sortOrder}&status=${status}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setComplaints(response.data);
		} catch (error) {
			console.error('Error fetching complaints:', error);
		}
	};

	// Function to get a specific complaint by ID
	const fetchComplaintById = async (id) => {
		try {
			const response = await axios.get(
				`http://localhost:3000/complaints/admin/${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setSelectedComplaint(response.data);
		} catch (error) {
			console.error('Error fetching complaint by ID:', error);
		}
	};

	// Function to reply to a complaint
	const handleReply = async (id) => {
		try {
			await axios.put(
				`http://localhost:3000/complaints/admin/reply/${id}`,
				{ reply },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			alert('Reply added successfully');
			setReply('');
			fetchComplaints();
		} catch (error) {
			console.error('Error replying to complaint:', error);
		}
	};

	// Function to update the status of a complaint
	const updateComplaintStatus = async (id) => {
		try {
			await axios.put(
				`http://localhost:3000/complaints/admin/status/${id}`,
				{ status },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			alert('Complaint status updated');
			setStatus('');
			fetchComplaints();
		} catch (error) {
			console.error('Error updating complaint status:', error);
		}
	};

	// Fetch all complaints when the component loads or when sort/filter changes
	useEffect(() => {
		fetchComplaints();
	}, [sortOrder, status]);

	return (
		<div className='min-h-screen bg-gray-100 p-6'>
			<h1 className='text-3xl font-bold text-center mb-8'>
				Admin Complaint Management
			</h1>

			{/* Sort and Filter Section */}
			<div className='flex justify-between items-center mb-6'>
				<div className='flex space-x-4'>
					{/* Sort Dropdown */}
					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
						className='border border-gray-300 p-2 rounded-md'>
						<option value='desc'>Newest First</option>
						<option value='asc'>Oldest First</option>
					</select>

					{/* Filter Dropdown */}
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className='border border-gray-300 p-2 rounded-md'>
						<option value=''>All Statuses</option>
						<option value='Pending'>Pending</option>
						<option value='Resolved'>Resolved</option>
					</select>
				</div>
			</div>

			{/* Complaints List */}
			<div className='bg-white p-6 rounded-lg shadow-md mb-6'>
				<h2 className='text-xl font-semibold mb-4'>All Complaints</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{complaints.map((complaint) => (
						<div
							key={complaint._id}
							onClick={() => fetchComplaintById(complaint._id)}
							className='cursor-pointer p-4 rounded-lg bg-gray-50 hover:bg-gray-200 border shadow-sm'>
							<p className='font-semibold text-teal-600'>{complaint.title}</p>
							<p className='text-sm text-gray-600 mt-1'>{complaint.details}</p>
							<span className='text-sm text-gray-500'>
								Status: {complaint.status}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Complaint Details */}
			{selectedComplaint && (
				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h2 className='text-xl font-semibold mb-4'>Complaint Details</h2>
					{/* ...details section here */}
				</div>
			)}
		</div>
	);
};

export default ComplaintsAdmin;
