import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function Message(props) {
  let {
    error,
    info,
  } = props;

  if (error) {
    return (
      <Text style={styles.error}>
        <p>{error}</p>
      </Text>
    );
  }

  return (
    <Text style={styles.info}>
      <p>{info}</p>
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 25,
    color: "red",
    padding: 20,
  },
  info: {
    fontSize: 20,
    padding: 10,
  },
});