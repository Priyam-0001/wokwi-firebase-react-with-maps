#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>

// WiFi credentials
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase credentials
#define API_KEY ""
#define DATABASE_URL ""
#define USER_EMAIL ""
#define USER_PASSWORD ""

// DHT config
#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWi-Fi connected");

  dht.begin();

  // Firebase setup
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Wait for sign-in to complete
  while (!Firebase.ready()) {
    delay(100);
  }
  Serial.println("Firebase is ready!");
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  float latitude = 26.74648;
  float longitude = 94.24863;

  if (isnan(temp) || isnan(hum)) {
    Serial.println("DHT sensor read failed");
    delay(5000);
    return;
  }

  FirebaseJson json;
  json.set("temperature", temp);
  json.set("humidity", hum);
  json.set("latitude", latitude);
  json.set("longitude", longitude);
  json.set("timestamp/.sv", "timestamp");

  String path = "/dhtLogs";

  if (Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json)) {
    Serial.println("Data sent successfully!");
  } else {
    Serial.print("Failed: ");
    Serial.println(fbdo.errorReason());
  }

  delay(7000);  // 7 seconds delay
}