const { response, request } = require('express');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config()

const app = express();
const port = process.env.PORT;
app.listen(port, () => console.log('listening on port 3000'));

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) =>{
        if(err){
            response.end();
            return;
        }
       response.json(data); 
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:city', async (request, response) => {
    console.log(request.params)
    const city = request.params.city;
   // const api_key = process.env.API_KEY;
    const api_url = `https://api.weatherapi.com/v1/current.json?key=78f01a854bfb46c1baa190627211006&q=${city}&aqi=yes`;
    //const api_url = `https://api.weatherapi.com/v1/current.json?key=78f01a854bfb46c1baa190627211006&q=Tholey&aqi=no`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});
