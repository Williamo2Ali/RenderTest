const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// المفاتيح الخاصة بك من حسابك في OpenSky
const CLIENT_ID = "williamo2.ali.1987@gmail.com-api-client";
const CLIENT_SECRET = "ML5Hgrkh0GyIsONmSywQqYYzKzAr9cWF";

// دالة جلب التوكن تلقائياً
async function getAccessToken() {
    const tokenUrl = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";
    
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    if (!response.ok) throw new Error(`فشل جلب التوكن: ${response.status}`);
    const data = await response.json();
    return data.access_token;
}

// رابط جلب بيانات الطائرات الحية
app.get('/flights', async (req, res) => {
    const url = 'https://opensky-network.org/api/states/all?lamin=20.0&lomin=30.0&lamax=35.0&lomax=45.0';

    try {
        const token = await getAccessToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) return res.status(response.status).json({ error: `خطأ من OpenSky: ${response.status}` });
        const data = await response.json();
        res.json(data.states || []);
    } catch (error) {
        res.status(500).json({ error: "فشل الاتصال", details: error.message });
    }
});

app.listen(PORT, () => console.log(`السيرفر يعمل على منفذ ${PORT}`));
