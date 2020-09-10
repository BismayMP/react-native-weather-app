import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

import Message from './Message';
import Weather from './Weather';

const API_KEY = 'weather_key_from_openweathermap.org';

export default function Scene() {
  const [sceneState, setSceneState] = useState("loading-location");
  const [weather, setWeather] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(
    () => {
      _uploadWeather();
    },
    []
  );

  const _getWeather = async (geo) => {
    try {
      const { data: { name: region,
        clouds: { all: cloudiness },
        main: { humidity, temp, temp_max, temp_min },
        dt: forecast,
        timezone,
        sys: { country, sunrise, sunset },
        visibility,
        weather: [{ description, main, id }],
        wind } }
        = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&APPID=${API_KEY}&units=metric`);

      const data = {
        country,
        region,
        altitude: parseInt(geo.alt),
        weather: { main, id, description },
        temperature: {},
        location: {},
        humidity,
        cloudiness, // % (percent)
        visibility: visibility / 1000, // kilo-meter
        wind,       // speed: meter/sec, deg: direction
      };
      data.temperature.current = Math.round(temp);
      data.temperature.min = temp_min;
      data.temperature.max = temp_max;
      data.location.lon = geo.lon;
      data.location.lat = geo.lat;

      return data;
    } catch (e) {
      throw new Error("Failed to get weather data");
    }
  }

  const _getLocation = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        throw new Error('Permission request was rejected.');
      }

      const { coords: { altitude: alt, latitude: lat, longitude: lon }, timestamp }
        = await Location.getCurrentPositionAsync();

      return { city: null, lat, lon };
    } catch (e) {
      throw new Error("Failed to get the current location of the device");
    }
  }

  const _uploadWeather = async () => {
    try {
      setSceneState("loading-location");
      let location = await _getLocation();

      setSceneState("loading-weather");
      let dataWeather = await _getWeather(location);

      setWeather(dataWeather);
      setSceneState("weather");
    } catch (error) {
      setErrorMsg(error.message);
      setSceneState("error");
    }
  }

  let scene;
  let uploadButton = (
    <Button
      title="Upload Weather"
      onPress={() => _uploadWeather()}
    />
  );

  switch (sceneState) {
    case 'loading-location':
      scene = (
        <Message info={'Getting the location coordinates ...'} />
      );
      break;
    case 'loading-weather':
      scene = (
        <Message info={'Getting the weather ...'} />
      );
      break;
    case 'weather':
      scene = (
        <>
          <Weather weather={weather} />
          {uploadButton}
        </>
      );
      break;
    case 'error':
      scene = (
        <>
          <Message error={errorMsg} />
          {uploadButton}
        </>
      );
      break;
    default:
      break;
  }

  return (
    <View style={styles.container}>
      {scene}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});