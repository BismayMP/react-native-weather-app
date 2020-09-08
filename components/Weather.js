import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Weather(props) {
  let {
    location,
    weather,
  } = props;

  return (
    <View>
      <Text style={styles.region}>
        Region: {weather.region || "ND"}
      </Text>
      <Text style={styles.location}>
        Lat: {location.lat || "ND"}
      </Text>
      <Text style={styles.location}>
        Lon: {location.lon || "ND"}
      </Text>
      <Text style={styles.wind}>
        Wind Speed: {weather.wind.speed || "ND"} Km
      </Text>
      <Text style={styles.temperature}>
        Temperature: {weather.temperatureCurrent || "ND"} C
      </Text>
      <Text style={styles.temperature}>
        Temperature min: {weather.temperatureMin || "ND"} C
      </Text>
      <Text style={styles.temperature}>
        Temperature max: {weather.temperatureMax || "ND"} C
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  region: {
    fontSize: 30,
    padding: 15,
  },
  location: {
    fontSize: 30,
    padding: 15,
  },
  wind: {
    fontSize: 30,
    padding: 15,
  },
  temperature: {
    fontSize: 30,
    padding: 15,
  },
});


