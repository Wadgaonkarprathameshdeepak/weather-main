const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/weatherDB'; // Update with your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a Weather schema and model
const WeatherSchema = new mongoose.Schema({
  city: String,
  date: Date,
  data: Object,
  temperature: Number,
});

const Weather = mongoose.model('Weather', WeatherSchema);

// Route to store weather data
app.post('/api/weather', async (req, res) => {
  const { city, date, data } = req.body;
  const temperature = data.main.temp;

  console.log("Data received:", { city, date, data, temperature });

  try {
    const newWeather = new Weather({ city, date, data, temperature });
    await newWeather.save();
    res.status(201).send('Weather data saved');
  } catch (err) {
    console.error("Error saving weather data:", err);
    res.status(400).send('Error saving weather data');
  }
});


// Route to get weather data
app.get('/api/weather', async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.status(200).json(weatherData);
  } catch (err) {
    res.status(400).send('Error fetching weather data');
  }
});


// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
