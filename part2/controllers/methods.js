const axios = require('axios');

module.exports.getDirections = async (dep, arr) => {
    let data = null;
    // The Directions API responds with an object where we can find the available routes 
    // (in this case we ask only for one but alternatives could be asked for), 
    // inside the object we can find all the coordinates that compose the directions between dep and arr on object.routes[index] 
    await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${dep};${arr}?geometries=geojson&access_token=pk.eyJ1IjoiZmlzaHN0aXh6IiwiYSI6ImNrems3b2p0MzIzZmgybm9jcjVzMHZ1aHoifQ.s6imzJ1hBpWdfdJzwmehOQ`)
        .then(response => {
            data = response.data;
        })
        .catch(err => {
            console.error(err);
        });
    return data.routes[0];
};

module.exports.getHighlights = async (lng, lat) => {
    let data = null;
    // The Tilequery API can provide more than one feature, so all features under a 50m radius of the 
    // coordinate will be returned to be added to a list on the route
    await axios.get(`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?radius=50&layers=poi_label&access_token=pk.eyJ1IjoiZmlzaHN0aXh6IiwiYSI6ImNrems3b2p0MzIzZmgybm9jcjVzMHZ1aHoifQ.s6imzJ1hBpWdfdJzwmehOQ`)
        .then(response => {
            data = response.data.features;
        })
        .catch(err => {
            console.error(err);
        });
    return data;
};

module.exports.closestHighlight = async (lng, lat) => {
    // The Tilequery API returns the least distance from the queried point first, so limiting to one 
    // will respond with the closest highlight
    await axios.get(`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?radius=50&limit=1&layers=poi_label&access_token=pk.eyJ1IjoiZmlzaHN0aXh6IiwiYSI6ImNrems3b2p0MzIzZmgybm9jcjVzMHZ1aHoifQ.s6imzJ1hBpWdfdJzwmehOQ`)
    .then(response => {
        data = response.data.features;
    })
    .catch(err => {
        console.error(err);
    });
    return data;
};