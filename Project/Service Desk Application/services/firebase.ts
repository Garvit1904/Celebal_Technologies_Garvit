import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAgqVNj43hE2kpPhBhMPDaZddiPFE1al5o",
  authDomain: "servicedeskapp-6e7cd.firebaseapp.com",
  projectId: "servicedeskapp-6e7cd",
  storageBucket: "servicedeskapp-6e7cd.firebasestorage.app",
  messagingSenderId: "634735143464",
  appId: "1:634735143464:web:906db022958045a168631d",
  measurementId: "G-GMWQKLSPCD"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);