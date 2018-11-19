import firebase from "firebase/app";
import 'firebase/auth';

// Required for side-effects
import "firebase/firestore";
import "firebase/functions"

var productionConfig = {
  apiKey: "AIzaSyC-me9B_zYX8s9SPICGngukj_4dJAVKomE",
  authDomain: "whosin-next.firebaseapp.com",
  projectId: "whosin-next",
};

var stagingConfig = {
  apiKey: "AIzaSyAwnCvJCDBf7AyOp-2iu17bPQy7Cvwb8lY",
  projectId: "timetospare-staging",
  authDomain: "timetospare-staging.firebaseapp.com"
}

export default !firebase.apps.length ? firebase.initializeApp(stagingConfig) : firebase.app();
