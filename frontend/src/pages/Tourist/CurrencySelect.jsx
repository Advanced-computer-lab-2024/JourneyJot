/** @format */

// CurrencySelect.js
import React from 'react';

const CurrencySelect = ({ selectedCurrency, rates, handleCurrencyChange }) => (
	<div className='flex space-x-2 items-center'>
		<label htmlFor='currency-select'>Select Currency:</label>
		<select
			id='currency-select'
			value={selectedCurrency}
			onChange={handleCurrencyChange}>
			{Object.keys(rates).map((currency) => (
				<option
					key={currency}
					value={currency}>
					{currency}
				</option>
			))}
		</select>
	</div>
);

export default CurrencySelect;
