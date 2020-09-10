import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function Weather(props) {
  const {
    region,
    location,
    wind,
    temperature,
  } = props.weather;

  return (
    <Text style={styles.weather}>
      <p>
        Region: {region || "ND"}
      </p>
      <p>
        Lat: {location.lat || "ND"}
      </p>
      <p>
        Lon: {location.lon || "ND"}
      </p>
      <p>
        Wind Speed: {wind.speed || "ND"} Km
      </p>
      <p>
        Temperature: {temperature.current || "ND"} C
      </p>
      <p>
        Temperature min: {temperature.min || "ND"} C
      </p>
      <p>
        Temperature max: {temperature.max || "ND"} C
      </p>
    </Text>
  );
}

const styles = StyleSheet.create({
  weather: {
    fontSize: 25,
  },
});