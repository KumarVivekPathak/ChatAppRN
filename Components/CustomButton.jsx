import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CustomButton = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    width: "60%",
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    alignSelf: "center",
    borderRadius: 30,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
});
