import firebase from "firebase/app";
import 'firebase/auth';

// Required for side-effects
import "firebase/firestore";
import "firebase/functions"

var config = {
  apiKey: "AIzaSyC-me9B_zYX8s9SPICGngukj_4dJAVKomE",
  authDomain: "whosin-next.firebaseapp.com",
  projectId: "whosin-next",
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
