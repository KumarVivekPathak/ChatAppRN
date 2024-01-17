import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

const CustomInput = (props) => {
  return (
    <View style={[styles.conatiner]}>
      <TextInput
        style={{
          width: "90%",
          height: 50,
          backgroundColor: "#D7DDDB",
        }}
        label={props.label}
        mode="outlined"
        onChangeText={props.onChangeText}
        value={props.value}
        outlineStyle={{ borderRadius: 15 }}
        keyboardType={props.keyboardType}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  conatiner: {
    alignItems: "center",
    marginVertical: 10,
  },
});
