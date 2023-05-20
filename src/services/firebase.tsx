// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXBsmIipf4d5cnyLznmM0n7dp2GG_Cgvw",
    authDomain: "ace-book-22f36.firebaseapp.com",
    projectId: "ace-book-22f36",
    storageBucket: "ace-book-22f36.appspot.com",
    messagingSenderId: "655700950205",
    appId: "1:655700950205:web:1db356cc51e33732a1cbd4",
    measurementId: "G-RJ8G6C58ZH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);