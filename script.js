const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'Gabaghoul31/Gabaghoul31.github.io';
const FILE_PATH = 'data.json';

// Load data from GitHub
app.get('/load-data', (req, res) => {
    axios.get(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3.raw'
        }
    }).then(response => {
        const listData = JSON.parse(response.data);
        res.json(listData);
    }).catch(error => {
        console.error('Error loading data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to load data', details: error.message });
    });
});

// Update data on GitHub
app.post('/update-data', (req, res) => {
    const data = req.body;
    const message = 'Update data.json';
    const content = Buffer.from(JSON.stringify(data)).toString('base64');

    axios.get(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
        }
    }).then(response => {
        const sha = response.data.sha;

        return axios.put(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            message,
            content,
            sha
        }, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
    }).then(() => {
        res.json({ message: 'Data updated successfully' });
    }).catch(error => {
        console.error('Error updating data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to update data', details: error.message });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
