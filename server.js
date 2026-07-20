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
    // Small geographical boundary to keep response data lightweight
    const url = 'https://opensky-network.org/api/states/all?lamin=30.0&lomin=31.0&lamax=30.5&lomax=31.5';

    try {
        const token = await getAccessToken();
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        res.json(response.data.states || []);
    } catch (error) {
        res.status(500).json({ 
            error: "Connection failed", 
            details: error.response ? error.response.data : error.message 
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
