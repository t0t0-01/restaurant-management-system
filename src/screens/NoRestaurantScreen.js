import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function NoRestaurantScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>No Restaurant Assigned Yet!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
