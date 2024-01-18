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
  serverTimestamp,
} from "firebase/firestore";

const ChatRoom = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const db = getFirestore(app);

  const route = useRoute();

  useEffect(() => {
    // Start listening to messages in this chat
    console.log("hscjkdhvd", route.params);
    const chatRef = collection(
      db,
      "chats",
      "" + route.params.id + route.params.data.userId,
      "messages"
    );
    console.log(
      "chat ref isss ",
      chatRef,
      route.params.id + route.params.data.userId
    );
    const q = query(chatRef, orderBy("createdAt", "desc"));

    const subscriber = onSnapshot(chatRef, (querySnapshot) => {
      console.log("quesry snapshot   ", querySnapshot);
      const allMessages = querySnapshot.docs.map((item) => {
        console.log("item id :: ", item.data());
        return { ...item.data(), createdAt: Date.parse(new Date()) };
      });
      console.log("messesfe", allMessages);
      setMessages(allMessages);
    });

    return () => {
      subscriber();
    };
  }, [route.params]);

  const onSend = useCallback(
    async (messages = []) => {
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
          "" + route.params.id + route.params.data.userId,
          "messages"
        ),
        { myMsg }
      );
      addDoc(
        collection(
          db,
          "chats",
          "" + route.params.data.userId + route.params.id,
          "messages"
        ),
        { myMsg }
      );
    },
    [route.params, db]
  );

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
