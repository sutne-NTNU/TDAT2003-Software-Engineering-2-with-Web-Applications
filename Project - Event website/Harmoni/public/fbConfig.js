var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.FIRBASE_APP_ID,
  projectId: process.env.FIRBASE_PROJECT_ID,
  authDomain: process.env.FIRBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIRBASE_DATABASE_URL,
  storageBucket: process.env.FIRBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.FIRBASE_MEASUREMENT_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.app().functions("europe-west");
let storage = firebase.storage();
