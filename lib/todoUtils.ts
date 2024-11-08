import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

export const addTodo = async (userId: string, title: string): Promise<void> => {
  await addDoc(collection(db, "todos"), {
    title,
    completed: false,
    userId,
  });
};

export const getTodos = async (userId: string): Promise<Todo[]> => {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Todo)
  );
};

export const updateTodo = async (
  id: string,
  completed: boolean
): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, { completed });
};

export const deleteTodo = async (id: string): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};
