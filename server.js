const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 10000;

app.use(cors());

// Your OpenSky Credentials (using basic auth is faster and avoids token timeout)
const USERNAME = "williamo2.ali.1987@gmail.com";
const PASSWORD = "ML5Hgrkh0GyIsONmSywQqYYzKzAr9cWF"; // Assuming this is your account password

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/flights', async (req, res) => {
    const airport = 'HECA'; 
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - (24 * 60 * 60); 
    
    const url = `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${oneDayAgo}&end=${now}`;

    try {
        // Creating Basic Auth header
        const authHeader = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

        const response = await axios.get(url, {
            headers: { 
                'Authorization': authHeader,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            timeout: 5000 // Force timeout after 5 seconds to prevent browser freezing
        });

        const data = response.data || [];
        res.json(data.slice(0, 10));
    } catch (error) {
        res.status(500).json({ 
            error: "Connection failed", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
