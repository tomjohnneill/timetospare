import firebase from "firebase/app";
import 'firebase/auth';
import "firebase/firestore";
import "firebase/functions"

//export const BUILD_LEVEL= "dev"
// export const BUILD_LEVEL = "staging"
export const BUILD_LEVEL = "production"

var productionConfig = {
  apiKey: "AIzaSyA8FFWoOifdusbuoYB2ksneSlPl-GwoLJo",
  authDomain: "timetospare-123.firebaseapp.com",
  projectId: "timetospare-123",
};

var stagingConfig = {
  apiKey: "AIzaSyAwnCvJCDBf7AyOp-2iu17bPQy7Cvwb8lY",
  projectId: "timetospare-staging",
  authDomain: "timetospare-staging.firebaseapp.com"
}

var config
if (BUILD_LEVEL == 'staging') {
  config = stagingConfig
} else if (BUILD_LEVEL == 'dev') {
  config = stagingConfig
} else if (BUILD_LEVEL == 'production') {
  config = productionConfig
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
