// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyBykRQiO0lYw8kpD-j0pkpFqMMwRtFk6BQ",
  authDomain: "minormajorweb.firebaseapp.com",
  projectId: "minormajorweb",
  storageBucket: "minormajorweb.firebasestorage.app",
  messagingSenderId: "955932363911",
  appId: "1:955932363911:web:596b76236a261342517c22",
  measurementId: "G-9TKYX4ZYQE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

window.auth = auth;
window.db = db;
