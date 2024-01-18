import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDiliIwETJetiWYY34nQ97mbHjWJWgEbuo",
  authDomain: "rnchatapp-feab7.firebaseapp.com",
  projectId: "rnchatapp-feab7",
  storageBucket: "rnchatapp-feab7.appspot.com",
  messagingSenderId: "557876422598",
  appId: "1:557876422598:web:a1ba2eb223427978f134c7",
  measurementId: "G-L9KQJ9LTH4",
  databaseURL:
    "https://rnchatapp-feab7-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// For more information on how to access Firebase in your project,
