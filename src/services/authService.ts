// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Creates a new user, stores profile in Firestore
 */
export async function signupUser(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  // Optional display name
  if (displayName) {
    await updateProfile(userCred.user, { displayName });
  }

  // Create user profile document
  await setDoc(doc(db, "users", userCred.user.uid), {
    email,
    displayName: displayName || "",
    createdAt: new Date(),
    role: "user",
    healthScore: 0,
  });

  return userCred;
}

/**
 * Logs in existing user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}
