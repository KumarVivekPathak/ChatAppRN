import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  //   [
  //     {
  //       myMsg: {
  //         user: { _id: "7a379296-cfc0-4646-af20-28580907b55d" },
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         createdAt: 1705598606000,
  //         _id: "11d71025-ded7-4f06-a511-92740de97720",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         text: "now white chat here",
  //       },
  //       createdAt: 1705598770000,
  //     },
  //     {
  //       myMsg: {
  //         user: { _id: "7a379296-cfc0-4646-af20-28580907b55d" },
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         createdAt: 1705598452000,
  //         _id: "912714d7-79c3-4658-8422-2037cf51513b",
  //         text: "ji here is me",
  //       },
  //       createdAt: 1705598770000,
  //     },
  //     {
  //       myMsg: {
  //         text: "Hhhhh",
  //         _id: "a329b613-3395-4c7b-8170-3291048a85f7",
  //         user: { _id: "7a379296-cfc0-4646-af20-28580907b55d" },
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         createdAt: 1705583462000,
  //       },
  //       createdAt: 1705598770000,
  //     },
  //   ]
  //   [
  //     ({
  //       myMsg: {
  //         user: { _id: "7a379296-cfc0-4646-af20-28580907b55d" },
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         createdAt: 1705598606000,
  //         _id: "11d71025-ded7-4f06-a511-92740de97720",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         text: "now white chat here",
  //       },
  //       createdAt: 1705598770000,
  //     },
  //     {
  //       myMsg: {
  //         user: { _id: "7a379296-cfc0-4646-af20-28580907b55d" },
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         createdAt: 1705598452000,
  //         _id: "912714d7-79c3-4658-8422-2037cf51513b",
  //         text: "ji here is me",
  //       },
  //       createdAt: 1705598770000,
  //     },
  //     {
  //       myMsg: {
  //         text: "Hhhhh",
  //         _id: "a329b613-3395-4c7b-8170-3291048a85f7",
  //         user: { _id: "7a379296-cfc0-4646-af20-28580907b55d" },
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         createdAt: 1705583462000,
  //       },
  //       createdAt: 1705598770000,
  //     })
  //   ];

  //   messesfe[
  //     {
  //       createdAt: 1705598221000,
  //       myMsg: {
  //         _id: "a329b613-3395-4c7b-8170-3291048a85f7",
  //         createdAt: 1705583462000,
  //         sendBy: "7a379296-cfc0-4646-af20-28580907b55d",
  //         sendTo: "LFWeCHQp9bvJ1Ezk42UH",
  //         text: "Hhhhh",
  //         user: [Object],
  //       },
  //     }
  //   ];

  //   useEffect(() => {
  //     setMessages([
  //       {
  //         _id: 1,
  //         text: "Hello developer",
  //         createdAt: new Date(),
  //         user: {
  //           _id: 2,
  //           name: "React Native",
  //           avatar: "https://placeimg.com/140/140/any",
  //         },
  //       },
  //     ]);
  //   }, []);

  useEffect(() => {
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
      setMessages(
        allMessages
          .map((item) => item.myMsg)
          .sort((a, b) => b.createdAt - a.createdAt)
      );
      console.log("messesfe", JSON.stringify(allMessages));
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
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
        isTyping={true}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    padding: 10,
    backgroundColor: "magenta",
  },
  headerText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "400",
  },
});
