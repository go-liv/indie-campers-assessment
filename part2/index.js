const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('./controllers/methods')

const app = express();
const port = 5000;

// Enforce usage of Cross-Origin Resource Sharing
app.use(cors());

// Enforce JSON type on response body
app.use(bodyParser.json());

// Highlights route
app.get('/api/highlights/:dep/:arr', async (req, res) => {
    console.log(`Request with dep=${req.params.dep} and arr=${req.params.arr}`);
    // Get all coordinates considered along the path between dep and arr
    const response = await controller.getDirections(req.params.dep, req.params.arr);
    const coors = response.geometry.coordinates;
    let highlights = [];
    // For each coordinate search for the relative highlights objects and add them to an array
    let loop = new Promise((resolve) => {
        coors.forEach(async (coor, index, coors) => {
            const features = await controller.getHighlights(coor[0], coor[1]);
            features.forEach(feature => {
                // Enforce that if certain values do not exist these will be changed to None
                highlights.push({
                    'POICoordinates': (!('coordinates' in feature.geometry)) ? 'None' : feature.geometry.coordinates,
                    'Name': (!('name' in feature.properties)) ? 'None' : feature.properties.name,
                    'Type': (!('type' in feature.properties)) ? 'None' : feature.properties.type,
                    'Class': (!('class' in feature.properties)) ? 'None' : feature.properties.class,
                    'Category': (!('category_en' in feature.properties)) ? 'None' : feature.properties.category_en,
                });
            });
            // End the promise when the code reaches the end of the list of coordinates
            if(index == coors.length -1) resolve(); 
        });
    });
    loop.then(() => {
        res.json(highlights);
    });
    loop.catch((err) => {
        console.error(err);
        res.status(err.status || 500).json({'error': err});
    });
});

// Closest highlight route
app.get('/api/closest/:lng/:lat', async (req, res) => {
    console.log(`Request with lng=${req.params.lng} and lat=${req.params.lat}`);
    // Receive closest highlight object to the given coordinate
    const response = await controller.closestHighlight(req.params.lng, req.params.lat);
    console.log(response[0]);
    // If there are no closeby highlights send an error to the user
    if(typeof(response[0]) === 'undefined') { 
        console.error('No available results for the asked coordinates.');
        res.status(503).json({'error': 'No available results for the asked coordinates.'})
    }
    // Else populate the response with an object containing information on the closest highlight
    else {
        res.json({
            'POICoordinates': (!('coordinates' in response[0].geometry)) ? 'None' : response[0].geometry.coordinates,
            'Name': (!('name' in response[0].properties)) ? 'None' : response[0].properties.name,
            'Type': (!('type' in response[0].properties)) ? 'None' : response[0].properties.type,
            'Class': (!('class' in response[0].properties)) ? 'None' : response[0].properties.class,
            'Category': (!('category_en' in response[0].properties)) ? 'None' : response[0].properties.category_en,
        });
    };
});

app.listen(port, () => {
    console.log(`Utilizando a port ${port}`);
});