import { db } from './config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { OrderRecord } from '../types';

export async function saveOrder(order: Omit<OrderRecord, 'id' | 'createdAt'>): Promise<string> {
  const ordersRef = collection(db, 'orders');
  const orderDoc = doc(ordersRef, order.reference);

  await setDoc(orderDoc, {
    ...order,
    createdAt: serverTimestamp(),
  });

  return order.reference;
}
