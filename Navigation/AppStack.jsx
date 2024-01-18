import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginPage from "../Screens/Login";
import SignUp from "../Screens/SignUp";
import ChatList from "../Screens/ChatList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatRoom from "../Screens/ChatRoom";

const Stack = createStackNavigator();

const AppStack = () => {
  const initialRouteName = async () => {
    let routeName = "";
    const id = await AsyncStorage.getItem("USERID");
    if (id !== null) {
      routeName = "ChatList";
    } else {
      routeName = "LoginPage";
    }
    return routeName;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
