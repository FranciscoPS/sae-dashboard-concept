import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchCarreras = async () => {
  const niHistorialRef = collection(db, "carreras");
  const response = await getDocs(niHistorialRef);
  return response.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};
