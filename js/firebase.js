// js/firebase.js
// Shared Firebase module (modular SDK)
// Drop this file into your repo at js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getDatabase,
  ref as dbRef,
  set as dbSet,
  get as dbGet,
  onValue
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// ---- YOUR FIREBASE CONFIG: replace with yours if different ----
const firebaseConfig = {
  apiKey: "AIzaSyCmUGqyM9fE7XY3daIYA-KFuvsdpqOVr-I",
  authDomain: "catchcode-80b46.firebaseapp.com",
  projectId: "catchcode-80b46",
  storageBucket: "catchcode-80b46.firebasestorage.app",
  messagingSenderId: "938706573319",
  appId: "1:938706573319:web:59ef10de90e15f1eaaf2a2",
  databaseURL: "https://catchcode-80b46-default-rtdb.firebaseio.com"
};
// ---------------------------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// create user (email+password) and initialize DB record
async function signUp(email, password, username = null) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  // write a minimal profile in Realtime DB
  await dbSet(dbRef(db, `users/${uid}`), {
    username: username || email.split('@')[0],
    xp: 0,
    level: 1,
    rank: 0,
    bio: '',
    courses: 0,
    activity: []
  });
  return cred.user;
}

// sign in (email+password)
async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

async function signOut() {
  await fbSignOut(auth);
}

// helper: redirect to index if not authenticated (use on protected pages)
function requireAuthRedirect(redirectTo = 'index.html') {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = redirectTo;
        return;
      }
      // ensure DB profile exists
      const snap = await dbGet(dbRef(db, `users/${user.uid}`));
      if (!snap.exists()) {
        await dbSet(dbRef(db, `users/${user.uid}`), {
          username: user.email.split('@')[0],
          xp: 0,
          level: 1,
          rank: 0,
          bio: '',
          courses: 0,
          activity: []
        });
      }
      resolve(user);
    });
  });
}

// simple read profile realtime listener
function listenUserProfile(uid, cb) {
  return onValue(dbRef(db, `users/${uid}`), (snap) => cb(snap.val()));
}

// upload profile pic to storage
async function uploadProfilePic(uid, file) {
  const sref = sRef(storage, `profiles/${uid}_${Date.now()}`);
  const snap = await uploadBytes(sref, file);
  return await getDownloadURL(snap.ref);
}

export {
  app, auth, db, storage,
  signUp, signIn, signOut, requireAuthRedirect,
  listenUserProfile, uploadProfilePic, dbRef, dbGet, dbSet
};
