import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation, useRoute } from "@react-navigation/native";
import { app } from "../firebaseconfig";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const ChatRoom = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const db = getFirestore(app);

  const route = useRoute();

  useEffect(() => {
    if (route.params) {
      // Start listening to messages in this chat
      const db = getFirestore();
      const chatRef = collection(
        db,
        "chats",
        route.params.id + route.params.data.id,
        "messages"
      );
      const q = query(chatRef, orderBy("createdAt", "desc"));

      const subscriber = onSnapshot(q, (querySnapshot) => {
        const allMessages = querySnapshot.docs.map((item) => {
          return { ...item.data, createdAt: Date.parse(new Date()) };
        });
        setMessages(allMessages);
      });

      return () => {
        subscriber();
      };
    }
  }, [route.params]);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.id,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    addDoc(
      collection(
        db,
        "chats",
        route.params.id + route.params.data.id,
        "messages"
      ),
      { myMsg }
    );
    addDoc(
      collection(
        db,
        "chats",
        route.params.data.id + route.params.id,
        "messages"
      ),
      { myMsg }
    );
  }, []);

  const Header = () => {
    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          height: 50,
          padding: 10,
          backgroundColor: "magenta",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: "400" }}>
          Chat With {route.params.data.name}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
