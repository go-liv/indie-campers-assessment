const axios = require('axios');

module.exports.getDirections = async (dep, arr) => {
    let data = null;
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
    await axios.get(`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?radius=50&layers=poi_label&access_token=pk.eyJ1IjoiZmlzaHN0aXh6IiwiYSI6ImNrems3b2p0MzIzZmgybm9jcjVzMHZ1aHoifQ.s6imzJ1hBpWdfdJzwmehOQ`)
        .then(response => {
            // console.log(`LNG-LAT --> ${lng}/${lat} \n ${response.data}`);
            data = response.data.features;
        })
        .catch(err => {
            console.error(err);
        });
    return data;
};