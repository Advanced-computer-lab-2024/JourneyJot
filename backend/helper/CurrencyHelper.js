// helper/currencyHelper.js
const axios = require('axios');

async function getExchangeRates() {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        return response.data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
}

module.exports = { getExchangeRates };
