import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db, collectionName } from "../firebase/config";

export const fetchCarreras = async () => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);

  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return data;
};

export const updateCollection = async (data) => {
  const collectionRef = collection(db, collectionName);

  const uploadPromises = data.map(async (row, index) => {
    const docRef = doc(collectionRef, `entry-${index}`);
    await setDoc(docRef, row);
  });

  await Promise.all(uploadPromises);
};
