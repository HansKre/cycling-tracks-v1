const express = require('express');
const app = express();
const PORT = 3000;
const { downloadDetailsGarmin } = require('./garmin.js');
const { downloadDetailsBosch } = require('./bosch.js');
const createHeatmap = require('./create-heatmap');
const { detailsFileNames } = require('./utils');

app.use(express.static('public'));

app.get('/download/garmin', async (req, res) => {
    const result = downloadDetailsGarmin();
    res.json(result);
});

app.get('/download/bosch', async (req, res) => {
    const result = downloadDetailsBosch();
    res.json(result);
});

app.get('/files', (req, res) => {
    res.json(detailsFileNames());
});

app.get('/heatmap/generate', (req, res) => {
    const result = createHeatmap();
    res.json(result);
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));