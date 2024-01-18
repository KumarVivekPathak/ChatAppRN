import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../Components/CustomInput";
import CustomButton from "../Components/CustomButton";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../firebaseconfig";
import Loader from "../Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = ({ navigation }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const db = getFirestore(app);

  const loginUser = async () => {
    setVisible(true);
    try {
      const q = query(
        collection(db, "users"),
        where("mobileNo", "==", mobileNo)
      );
      const querySnapshot = await getDocs(q);
      setVisible(false);

      if (querySnapshot.empty) {
        // No user with the provided mobileNo found
        Alert.alert(
          "User not found",
          "Please check your mobile number or Sign Up."
        );
      } else {
        // User found, check if the password matches
        const userDoc = querySnapshot.docs[0]; // Assuming there's only one user with the given mobileNo

        const userData = userDoc.data();
        const storedPassword = userData.password;

        if (password === storedPassword) {
          const mobileNo = userData.mobileNo;
          const name = userData.name;
          const userId = userData.userId;
          gotoNext(userId, name, mobileNo);
        } else {
          // Passwords do not match
          Alert.alert("Incorrect Password", "Please check your password.");
        }
      }
    } catch (error) {
      setVisible(false);
      console.error("An error occurred: ", error);
      Alert.alert("An error has occurred");
    }
  };

  const gotoNext = async (userId, name, mobileNo) => {
    await AsyncStorage.setItem("NAME", name);
    await AsyncStorage.setItem("MOBILE_NO", mobileNo);
    await AsyncStorage.setItem("USERID", userId);
    navigation.navigate("ChatList");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.loginText}>Login</Text>
      <CustomInput
        label="Mobile No"
        onChangeText={(text) => setMobileNo(text)}
        keyboardType="number-pad"
        value={mobileNo}
      />
      <CustomInput
        label="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <CustomButton title="Login" onPress={() => loginUser()} />

      <Text
        style={styles.signUpText}
        onPress={() => navigation.navigate("SignUp")}
      >
        Or SignUp
      </Text>
      <Loader visible={visible} />
    </SafeAreaView>
  );
};

export default LoginPage;

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
    marginBottom: 40,
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
