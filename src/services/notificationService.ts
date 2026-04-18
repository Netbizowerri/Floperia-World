import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type NotificationType = 'order' | 'training' | 'event' | 'contact' | 'newsletter';

export interface AdminNotification {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: any;
}

export const createNotification = async (type: NotificationType, title: string, message: string, data: any = {}) => {
  try {
    // 1. Save to Firestore for Dashboard feed
    await addDoc(collection(db, 'notifications'), {
      type,
      title,
      message,
      data,
      read: false,
      createdAt: serverTimestamp()
    });

    // 2. Trigger Privyr Webhook for Email/Lead notification
    try {
      // Map Firestore data to Privyr fields
      const privyrBody = {
        name: data.name || data.fullName || (data.deliveryDetails?.fullName) || "New Lead",
        email: data.email || (data.deliveryDetails?.email) || "",
        phone: data.phone || (data.deliveryDetails?.phone) || "",
        lead_source: `Floperia - ${type.toUpperCase()}`,
        notes: `
Type: ${type.toUpperCase()}
Subject: ${title}
Details: ${message}
${data.course ? `Course: ${data.course}` : ''}
${data.type ? `Event Type: ${data.type}` : ''}
${data.date ? `Event Date: ${data.date}` : ''}
${data.message ? `Message: ${data.message}` : ''}
${data.order ? `Order ID: ${data.order.id}` : ''}
${data.deliveryDetails?.address ? `Shipping: ${data.deliveryDetails.address}, ${data.deliveryDetails.city}` : ''}
        `.trim()
      };

      await fetch('/api/privyr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privyrBody)
      });
    } catch (privyrError) {
      // Don't fail the whole operation if Privyr fails, just log it
      console.error('Privyr notification failed:', privyrError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};

export const subscribeToNotifications = (onUpdate: (notifications: AdminNotification[]) => void, max: number = 20) => {
  const q = query(
    collection(db, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(max)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AdminNotification[];
    onUpdate(notifications);
  });
};

export const markAsRead = async (notificationId: string) => {
  try {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
