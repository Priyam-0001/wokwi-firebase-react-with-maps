# 🌡️ Real-time Temperature & Humidity Dashboard using ESP32 + Firebase + ReactJS

This project visualizes real-time temperature and humidity data collected from a DHT22 sensor connected to an ESP32 microcontroller. The sensor readings are pushed to Firebase Realtime Database and displayed in a sleek ReactJS dashboard with charts and a live map view.

> ⚠️ Note: Since the Wokwi VS Code extension doesn't support GPS modules, fixed latitude and longitude coordinates are used in the map display.

## 🚀 Features

- 📡 ESP32 reads data from a DHT22 sensor
- 🔥 Realtime data sync using Firebase
- 📊 Live dashboard built in ReactJS
- 🗺️ Map showing sensor data with location markers (mock lat/lng)
- 📈 Charts for temperature & humidity trends
- 🕒 IST timestamp conversion for logs

## 🛠️ Tech Stack

- ESP32 (Arduino Framework in Wokwi)
- Firebase Realtime Database
- ReactJS (with Chart.js and Leaflet)
- TailwindCSS for styling
