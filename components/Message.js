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
        {error}
      </Text>
    );
  }

  return (
    <Text style={styles.info}>
      {info}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 25,
    color: "#FF0000",
    padding: 20,
  },
  info: {
    fontSize: 20,
    padding: 10,
  },
});
