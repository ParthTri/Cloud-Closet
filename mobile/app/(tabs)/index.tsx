import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useAuth } from "../authContext";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Logo } from "@/components/Logo";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const { user, logout } = useAuth(); // Get user data from AuthContext
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [loading, setLoading] = useState(true);

  //weather API
  const API_Weather = "https://cloudcloset.kolide.co.nz/api/weather";

  const [weatherData, setWeatherData] = useState({
    weather: "Loading...",
    temperature: null,
    location: "",
  });

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const response = await axios.post(API_Weather, {
        latitude: -36.848461,
        longitude: 174.763336,
    });

      //console.log("Weather data response:", response.data); 

      const { data, error } = response.data;

      if (error) {
        throw new Error(error);
      }

      setWeatherData({
        weather: data.weather,
        temperature: data.temperature,
        location: data.location,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response ? error.response.data : error.message);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
      setWeatherData({
        weather: "Unavailable",
        temperature: null,
        location: "",
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    const latitude = -36.848461; 
    const longitude = 174.763336; 
    fetchWeatherData(latitude, longitude);
  }, []);


  interface WeatherProps {
    weather: string;
    temperature: number | null;
  }
  
  const Weather: React.FC<WeatherProps> = ({ weather, temperature }) => {
    const weatherImages: { [key: string]: any } = {
      Clear: require('../../assets/weather/sun.png'),
      Clouds: require('../../assets/weather/cloudy.png'),
      Rain: require('../../assets/weather/rainy-1.png'),
      Thunderstorm: require('../../assets/weather/storm-1.png'),
      Drizzle: require('../../assets/weather/rainy.png'),
      Atmosphere: require('../../assets/weather/foog.png'),
    };
  
    const weatherImage = weatherImages[weather] || require('../../assets/weather/night.png'); // Default image - need to find one
  
    return (
      <View style={styles.weatherContainer}>
        <View style={styles.weatherInfo}>
          <Image source={weatherImage} style={styles.weatherImage} />
          <View style={styles.weatherTextContainer}>
            <Text style={styles.weatherDate}>Today</Text>
            <Text style={styles.weatherTemp}>
              {weatherData.temperature !== null ? `${weatherData.temperature}°C` : "N/A"}
            </Text>
            <Text style={styles.weatherLocation}>{weatherData.location || "Unknown Location"}</Text>
          </View>
        </View>
      </View>
    );
  };
 
  // test - need to replace??? with actual notifs
  const notifications = [
    { id: 1, message: "New outfit suggestion available!" },
    { id: 2, message: "Your outfit has been saved successfully." },
    { id: 3, message: "Weather update: Chance of rain today." },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Logo logoWidth={30} logoHeight={30} />
        <Text style={styles.header}>CLOUD CLOSET</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons name="notifications-outline" size={30} color="black" />
        </Pressable>
      </View>

      {/* this is the notifications */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Text key={notification.id} style={styles.notificationBox}>
                  {notification.message}
                </Text>
              ))
            ) : (
              <Text style={styles.noNotificationsText}>
                No new notifications
              </Text>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

        {/* Weather Info - added most of the design to the return statement*/}
        {loading ? (
          <Text>Loading weather data...</Text>
        ) : (
            <Weather weather={weatherData.weather} temperature={weatherData.temperature} />
        )}

      {/* Generate Outfit Button */}
      <Pressable
        style={[
          styles.generateButton,
          { backgroundColor: buttonPressed ? "#F9F9F9" : "#8ABAE3" }, // Change color based on state
        ]}
        onPressIn={() => setButtonPressed(true)} // When button is pressed
        onPressOut={() => setButtonPressed(false)} // When button is released
      >
        <Text style={styles.generateButtonText}>GENERATE OUTFIT</Text>
      </Pressable>

      <Text style={styles.sectionHeader}>Saved Outfits</Text>

      <ScrollView>
        <View style={styles.outfitGrid}>
          {[...Array(6)].map((_, index) => (
            <View key={index} style={styles.outfitItem}>
              {/*  replace this with saved outfits image */}
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.outfitImage}
              />
              <Text style={styles.outfitText}>Outfit {index + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  notificationBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noNotificationsText: {
    fontSize: 16,
    color: "gray",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#8ABAE3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  weatherContainer: {
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "stretch",
    borderWidth: 1,
	  flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherTextContainer: {
    marginLeft: 10,
  },
  weatherDate: {
    fontSize: 16,
    color: "gray",
  },
  weatherLocation: {
    fontSize: 18,
    color: "#333333",
    fontWeight: "bold",
    marginTop: 5,
  },
  weatherImage: {
    width: 85,
    height: 85,
    marginRight: 15,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: "bold",
  },
  weatherCondition: {
    fontSize: 24,
    fontWeight: "bold",
  },
  generateButton: {
    backgroundColor: "#8ABAE3",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  outfitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  outfitItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  outfitImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  outfitText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
});
