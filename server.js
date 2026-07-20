const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 10000;

app.use(cors());

const CLIENT_ID = "williamo2.ali.1987@gmail.com-api-client";
const CLIENT_SECRET = "ML5Hgrkh0GyIsONmSywQqYYzKzAr9cWF";

async function getAccessToken() {
    const tokenUrl = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";
    
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await axios.post(tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data.access_token;
}

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/flights', async (req, res) => {
    // A slightly wider boundary to ensure we catch flights, but we will filter them below
    const url = 'https://opensky-network.org/api/states/all?lamin=20.0&lomin=30.0&lamax=35.0&lomax=45.0';

    try {
        const token = await getAccessToken();
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const allStates = response.data.states || [];
        
        // Filter and map the data to keep it extremely lightweight (Limit to 10 flights)
        const limitedFlights = allStates.slice(0, 10).map(flight => {
            return {
                icao24: flight[0],
                callsign: flight[1] ? flight[1].trim() : 'UNKNOWN',
                origin_country: flight[2],
                longitude: flight[5],
                latitude: flight[6],
                altitude: flight[7],
                velocity: flight[9]
            };
        });

        res.json(limitedFlights);
    } catch (error) {
        res.status(500).json({ 
            error: "Connection failed", 
            details: error.response ? error.response.data : error.message 
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
