const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 10000;

app.use(cors());

// Your AviationStack API Key
const API_KEY = "634362ecfab7e52c26cff0af91d7253b";

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/flights', async (req, res) => {
    // Standard HTTP URL for AviationStack free tier
    const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&limit=10`;

    try {
        const response = await axios.get(url, { timeout: 8000 });
        
        // Extract the array of real live flights
        const liveFlights = response.data.data || [];
        res.json(liveFlights);
    } catch (error) {
        res.status(500).json({ 
            error: "Live data fetch failed", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
