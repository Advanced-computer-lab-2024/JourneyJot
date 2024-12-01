/** @format */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SharedAttractionPage = () => {
	const { id } = useParams();
	const [attraction, setAttraction] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAttraction = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/attractions/${id}`
				);
				setAttraction(response.data);
			} catch (err) {
				setError('Failed to load attraction details. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchAttraction();
	}, [id]);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<p className='text-gray-500 text-lg'>Loading attraction details...</p>
			</div>
		);
	}

	if (error) {
		return <p className='text-center text-red-500'>{error}</p>;
	}

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg mt-6 space-y-6'>
			{attraction ? (
				<>
					<h1 className='text-3xl font-semibold text-gray-800'>
						{attraction.name || 'No name provided'}
					</h1>

					<ul className='space-y-4 text-gray-700'>
						<li>
							<span className='font-semibold'>Governor: </span>
							{attraction.governorId?.username || 'NA'}
						</li>
						<li>
							<span className='font-semibold'>Description: </span>
							{attraction.description || 'No description available.'}
						</li>

						{/* Pictures */}
						{attraction.pictures && attraction.pictures.length > 0 ? (
							<li>
								<span className='font-semibold'>Pictures: </span>
								<ul className='list-disc pl-5'>
									{attraction.pictures.map((pic, index) => (
										<li key={index}>{pic}</li>
									))}
								</ul>
							</li>
						) : (
							<li>
								<span className='font-semibold'>Pictures: </span> No pictures
								available.
							</li>
						)}

						{/* Location */}
						<li>
							<span className='font-semibold'>Location: </span>
							{attraction.location || 'Location not specified.'}
						</li>

						{/* Opening Hours */}
						<li>
							<span className='font-semibold'>Opening Hours: </span>
							{attraction.openingHours || 'Hours not available.'}
						</li>

						{/* Tags */}
						{attraction.tags && attraction.tags.length > 0 ? (
							<li>
								<span className='font-semibold'>Tags: </span>
								<ul className='list-disc pl-5'>
									{attraction.tags.map((tag, index) => (
										<li key={index}>{tag || 'No tag name'}</li>
									))}
								</ul>
							</li>
						) : null}
					</ul>
				</>
			) : (
				<p className='text-center text-gray-500'>
					No details available for this attraction.
				</p>
			)}
		</div>
	);
};

export default SharedAttractionPage;
