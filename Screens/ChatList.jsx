import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { app } from "../firebaseconfig";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

let userId = "";
const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Firebase Chat App</Text>
    </View>
  );
};
const ChatList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const db = getFirestore(app);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    userId = await AsyncStorage.getItem("USERID");
    const usersCollection = collection(db, "users");

    const q = query(usersCollection, where("userId", "!=", userId));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("No Users are there");
      } else {
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  renderUserItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChatRoom", { data: item, id: userId })
        }
        style={styles.itemContainer}
      >
        <Image
          source={require("../assets/user.png")}
          style={{ height: 40, width: 40 }}
        />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderUserItem(item)}
      />
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "auto",
    padding: "auto",
  },
  headerContainer: {
    backgroundColor: "magenta",
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  headerText: {
    color: "white",
    fontWeight: "700",
    fontSize: 22,
  },
  itemContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginVertical: 8,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#000",
    marginLeft: 20,
  },
});
