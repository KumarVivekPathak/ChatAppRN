import { View, Text } from "react-native";
import AppStack from "./Navigation/AppStack";
import { useEffect } from "react";
import { app } from "./firebaseconfig";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  useEffect(() => {
    getFirestore(app);
  }, []);

  return <AppStack />;
};

export default App;
