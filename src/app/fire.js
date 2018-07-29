import firebase from "firebase/app";
import 'firebase/auth';

// Required for side-effects
import "firebase/firestore";

var config = {
  apiKey: "AIzaSyC-me9B_zYX8s9SPICGngukj_4dJAVKomE",
  authDomain: "timetospare.org.uk",
  projectId: "whosin-next",
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
