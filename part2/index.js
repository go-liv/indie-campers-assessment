const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('./controllers/methods')

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/highlights/:dep/:arr', async (req, res) => {
    console.log(`Request with dep=${req.params.dep} and arr=${req.params.arr}`);
    const response = await controller.getDirections(req.params.dep, req.params.arr);
    const coors = response.geometry.coordinates;
    let highlights = [];
    let loop = new Promise((resolve, reject) => {
        coors.forEach(async (coor, index, coors) => {
            const features = await controller.getHighlights(coor[0], coor[1]);
            features.forEach(feature => {
                highlights.push({
                    'POICoordinates': (!('coordinates' in feature.geometry)) ? 'None' : feature.geometry.coordinates,
                    'Name': (!('name' in feature.properties)) ? 'None' : feature.properties.name,
                    'Type': (!('type' in feature.properties)) ? 'None' : feature.properties.type,
                    'Class': (!('class' in feature.properties)) ? 'None' : feature.properties.class,
                });
            });
            if(index == coors.length -1) resolve(); 
        });
    });
    loop.then(() => {
        res.json(highlights);
    });
});

app.listen(port, () => {
    console.log(`Utilizando a port ${port}`);
});