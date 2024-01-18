import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../Components/CustomInput";
import CustomButton from "../Components/CustomButton";
import uuid from "react-native-uuid";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from "../firebaseconfig";

const SignUp = ({ navigation }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const db = getFirestore(app);
  const registerUser = async () => {
    const userId = uuid.v4();
    await addDoc(collection(db, "users"), {
      userId: userId,
      name: name,
      mobileNo: mobileNo,
      password: password,
    })
      .then((res) => {
        Alert.alert("User is created: :) "), navigation.navigate("LoginPage");
      })
      .catch((error) => console.log("Error", error));
  };

  const validate = () => {
    let isValid = true;
    if (name == "") isValid = false;
    if (mobileNo == "" || mobileNo.length < 10) isValid = false;
    if (password == "" || password !== confirmPassword) isValid = false;
    return isValid;
  };
  const validateAndRegister = () => {
    if (validate()) registerUser();
    else Alert.alert("Please enter details properly");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.loginText}>SignUp</Text>
      <CustomInput
        label="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <CustomInput
        label="Mobile No"
        onChangeText={(text) => setMobileNo(text)}
        value={mobileNo}
        keyboardType="number-pad"
      />
      <CustomInput
        label="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <CustomInput
        label="Confirm Password"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />
      <CustomButton title="SignUp" onPress={validateAndRegister} />

      <Text style={styles.signUpText} onPress={() => navigation.goBack()}>
        Or Login
      </Text>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    height: "100%",
    width: "100%",
    backgroundColor: "#D4FEEE",
  },
  loginText: {
    color: "green",
    fontSize: 24,
    fontWeight: "800",
    alignSelf: "center",
    marginBottom: 20,
  },
  signUpText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    alignSelf: "center",
    textDecorationLine: "underline",
  },
});
