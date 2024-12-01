/** @format */

import React from 'react';
import PropTypes from 'prop-types';

const FlightOffers = ({ flightOffers = [], onBook }) => {
	return (
		<div>
			<h2 className='text-2xl font-bold mb-4'>Available Flight Offers</h2>
			{flightOffers.length === 0 ? (
				<p>
					No flights available for the selected criteria. Please try a different
					search.
				</p>
			) : (
				<ul>
					{flightOffers.map((offer) => {
						const {
							id,
							itineraries = [],
							price = {},
							validatingAirlineCodes = [],
						} = offer;
						const itinerary = itineraries[0] || {};
						const segments = itinerary.segments || [];
						const departure = segments[0]?.departure || {};
						const arrival = segments[segments.length - 1]?.arrival || {};
						const duration =
							itinerary?.duration?.replace('PT', '').toLowerCase() || 'N/A';
						const stops = segments.length > 0 ? segments.length - 1 : 0;
						const airline = validatingAirlineCodes.join(', ') || 'N/A';
						const totalPrice = price.total || 'N/A';
						const currency = price.currency || '';
						const departureTime = departure.at
							? new Date(departure.at).toLocaleString()
							: 'N/A';
						const arrivalTime = arrival.at
							? new Date(arrival.at).toLocaleString()
							: 'N/A';

						return (
							<li
								key={id}
								className='mb-4 p-4 border rounded shadow'>
								<p>
									<strong>Flight ID:</strong> {id}
								</p>
								<p>
									<strong>Airline:</strong> {airline}
								</p>
								<p>
									<strong>Origin:</strong> {departure.iataCode || 'N/A'}
								</p>
								<p>
									<strong>Destination:</strong> {arrival.iataCode || 'N/A'}
								</p>
								<p>
									<strong>Departure Time:</strong> {departureTime}
								</p>
								<p>
									<strong>Arrival Time:</strong> {arrivalTime}
								</p>
								<p>
									<strong>Duration:</strong> {duration}
								</p>
								<p>
									<strong>Number of Stops:</strong> {stops}
								</p>
								<p>
									<strong>Total Price:</strong> {totalPrice} {currency}
								</p>
								<button
									onClick={() => onBook(offer)}
									className='bg-blue-600 text-white px-4 py-2 rounded mt-4'>
									Book This Flight
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

// Default Props
FlightOffers.defaultProps = {
	flightOffers: [],
};

// Prop Types
FlightOffers.propTypes = {
	flightOffers: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			itineraries: PropTypes.arrayOf(
				PropTypes.shape({
					segments: PropTypes.arrayOf(
						PropTypes.shape({
							departure: PropTypes.shape({
								iataCode: PropTypes.string,
								at: PropTypes.string,
							}),
							arrival: PropTypes.shape({
								iataCode: PropTypes.string,
								at: PropTypes.string,
							}),
						})
					),
					duration: PropTypes.string,
				})
			),
			price: PropTypes.shape({
				total: PropTypes.string,
				currency: PropTypes.string,
			}),
			validatingAirlineCodes: PropTypes.arrayOf(PropTypes.string),
		})
	),
	onBook: PropTypes.func.isRequired,
};

export default FlightOffers;
