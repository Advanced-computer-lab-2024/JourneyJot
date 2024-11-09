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
					{/* Sort by Date */}
					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
						className='border border-gray-300 p-2 rounded-md'>
						<option value='desc'>Sort by Date (Newest)</option>
						<option value='asc'>Sort by Date (Oldest)</option>
					</select>

					{/* Filter by Status */}
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

			{/* List of complaints */}
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

			{/* Selected complaint details */}
			{selectedComplaint && (
				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h2 className='text-xl font-semibold mb-4'>Complaint Details</h2>
					<p className='mb-2'>
						<span className='font-medium'>Title:</span>{' '}
						{selectedComplaint.title}
					</p>
					<p className='mb-2'>
						<span className='font-medium'>Details:</span>{' '}
						{selectedComplaint.body}
					</p>
					<p className='mb-2'>
						<span className='font-medium'>Date:</span> {selectedComplaint.date}
					</p>
					<p className='mb-2'>
						<span className='font-medium'>Status:</span>{' '}
						{selectedComplaint.status}
					</p>
					<p className='mb-6'>
						<span className='font-medium'>Reply:</span>{' '}
						{selectedComplaint.reply || 'No reply yet'}
					</p>

					{/* Reply to complaint */}
					<div className='mb-4'>
						<h3 className='font-semibold mb-2'>Reply to Complaint</h3>
						<input
							type='text'
							value={reply}
							onChange={(e) => setReply(e.target.value)}
							placeholder='Type your reply'
							className='w-full border border-gray-300 p-2 rounded mb-2'
						/>
						<button
							onClick={() => handleReply(selectedComplaint._id)}
							className='bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition'>
							Send Reply
						</button>
					</div>

					{/* Update complaint status */}
					<div className='mb-4'>
						<h3 className='font-semibold mb-2'>Update Status</h3>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className='w-full border border-gray-300 p-2 rounded mb-2'>
							<option value=''>Select Status</option>
							<option value='Pending'>Pending</option>
							<option value='Resolved'>Resolved</option>
						</select>
						<button
							onClick={() => updateComplaintStatus(selectedComplaint._id)}
							className='bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition'>
							Update Status
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ComplaintsAdmin;