// routes/currencyRoutes.js
const express = require('express');
const router = express.Router();
const { getExchangeRates } = require('../helper/CurrencyHelper');

router.get('/rates', async (req, res) => {
    try {
        const rates = await getExchangeRates();
        if (!rates) {
            return res.status(500).json({ error: 'Failed to fetch exchange rates' });
        }
        res.json(rates);
    } catch (error) {
        console.error('Error in /rates route:', error);
        res.status(500).json({ error: 'An error occurred while fetching exchange rates' });
    }
});

module.exports = router;
