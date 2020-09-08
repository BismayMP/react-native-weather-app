import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

import Message from './components/Message';
import Weather from './components/Weather';

const API_KEY = 'weather_key_from_openweathermap.org';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sceneState: "loading-location",
      location: {},
      weather: {},
      errorMsg: "",
    };
  }

  async _getWeather(geo) {
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
        humidity,
        cloudiness, // % (percent)
        visibility: visibility / 1000, // kilo-meter
        wind,       // speed: meter/sec, deg: direction
        dt: { timezone }
      };
      data.temperatureCurrent = Math.round(temp);
      data.temperatureMin = temp_min;
      data.temperatureMax = temp_max;
      data.dt.forecast = new Date(forecast * 1000);
      data.dt.sunrise = new Date(sunrise * 1000);
      data.dt.sunset = new Date(sunset * 1000);
      data.geocode = (geo.city == null) ? { ...geo, city: data.region } : geo;

      return data;
    } catch (e) {
      throw new Error("Failed to get weather data");
    }
  }

  async _getLocation() {
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

  async _uploadWeather() {
    try {
      this.setState({ sceneState: "loading-location" });
      let location = await this._getLocation();

      this.setState({ sceneState: "loading-weather" });
      let weather = await this._getWeather(location);

      this.setState({
        sceneState: "weather",
        location,
        weather,
      });
    } catch (error) {
      this.setState({
        sceneState: "error",
        errorMsg: error.message,
      });
    }
  }

  _scene = () => {
    let scene;
    let uploadButton = (
      <Button
        title="Upload Weather"
        onPress={() => this._uploadWeather()}
      />
    );

    switch (this.state.sceneState) {
      case 'loading-location':
        scene = (
          <View style={styles.container}>
            <Message info={'Getting the location coordinates ...'} />
          </View>
        );
        break;
      case 'loading-weather':
        scene = (
          <View style={styles.container}>
            <Message info={'Getting the weather ...'} />
          </View>
        );
        break;
      case 'weather':
        scene = (
          <View style={styles.container}>
            <Weather
              location={this.state.location}
              weather={this.state.weather}
            />
            {uploadButton}
          </View>
        );
        break;
      case 'error':
        scene = (
          <View style={styles.container}>
            <Message error={this.state.errorMsg} />
            {uploadButton}
          </View>
        );
        break;
      default:
        break;
    }
    return scene;
  }

  render() {
    return (
      this._scene()
    );
  }

  componentDidMount() {
    this._uploadWeather();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});