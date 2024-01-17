import { View, Text } from "react-native";
import AppStack from "./Navigation/AppStack";
// import { initializeApp } from "@react-native-firebase/app";
import { useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseconfig";

const App = () => {
  useEffect(() => {
    getFirestore(app);
  }, []);
  return <AppStack />;
};

export default App;
