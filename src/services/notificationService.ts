import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DeliveryDetails, Order } from '../types';

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

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildPrivyrNotes = (type: NotificationType, title: string, message: string, data: any = {}) => {
  const order = data.order as Order | undefined;
  const deliveryDetails = data.deliveryDetails as DeliveryDetails | undefined;
  const orderItems = order?.items?.length
    ? order.items.map((item) => `- ${item.name} x${item.quantity} (${item.price})`).join('\n')
    : '';

  return `
Type: ${type.toUpperCase()}
Subject: ${title}
Details: ${message}
${data.course ? `Course: ${data.course}` : ''}
${data.type ? `Event Type: ${data.type}` : ''}
${data.date ? `Event Date: ${data.date}` : ''}
${data.message ? `Message: ${data.message}` : ''}
${order ? `Order ID: ${order.id}` : ''}
${order ? `Payment Method: ${order.paymentMethod}` : ''}
${order ? `Order Total: ${order.total}` : ''}
${orderItems ? `Items:\n${orderItems}` : ''}
${deliveryDetails?.address ? `Shipping: ${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state}` : ''}
${deliveryDetails?.notes ? `Customer Notes: ${deliveryDetails.notes}` : ''}
  `.trim();
};

const buildAdminEmailHtml = (type: NotificationType, title: string, message: string, data: any = {}) => {
  const order = data.order as Order | undefined;
  const deliveryDetails = data.deliveryDetails as DeliveryDetails | undefined;
  const detailRows = [
    ['Type', type.toUpperCase()],
    ['Subject', title],
    ['Summary', message],
    ['Name', data.name || data.fullName || deliveryDetails?.fullName || ''],
    ['Email', data.email || deliveryDetails?.email || ''],
    ['Phone', data.phone || deliveryDetails?.phone || ''],
    ['Course', data.course || ''],
    ['Event Type', data.type || ''],
    ['Event Date', data.date || ''],
    ['Order ID', order?.id || ''],
    ['Payment Method', order?.paymentMethod || ''],
    ['Order Total', order?.total ? `NGN ${Number(order.total).toLocaleString()}` : ''],
    ['Shipping Address', deliveryDetails?.address ? `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state}` : ''],
    ['Customer Notes', deliveryDetails?.notes || data.message || ''],
  ].filter(([, value]) => value);

  const orderItems = order?.items?.length
    ? `
      <div style="margin-top:24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#4a0e3c;">Order Items</h3>
        <ul style="margin:0;padding-left:20px;color:#444;">
          ${order.items.map((item) => `<li>${escapeHtml(item.name)} x${item.quantity} - NGN ${Number(item.price).toLocaleString()}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  const rawDetails = `
    <div style="margin-top:24px;">
      <h3 style="margin:0 0 12px;font-size:16px;color:#4a0e3c;">Raw Payload</h3>
      <pre style="white-space:pre-wrap;background:#f8f5f7;border-radius:12px;padding:16px;font-size:12px;color:#333;overflow:auto;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
    </div>
  `;

  return `
    <div style="font-family:Arial,sans-serif;background:#f8f5f7;padding:24px;color:#1f1f1f;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;border:1px solid #eadfe5;">
        <div style="margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9c7a8d;">Floperia Admin Notification</p>
          <h1 style="margin:0;font-size:28px;line-height:1.2;color:#4a0e3c;">${escapeHtml(title)}</h1>
          <p style="margin:12px 0 0;font-size:15px;color:#555;">${escapeHtml(message)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${detailRows.map(([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-top:1px solid #f0e8ec;width:180px;font-weight:700;color:#4a0e3c;">${escapeHtml(label)}</td>
                <td style="padding:10px 0;border-top:1px solid #f0e8ec;color:#444;">${escapeHtml(value)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${orderItems}
        ${rawDetails}
      </div>
    </div>
  `;
};

export const sendAdminEmailNotification = async (type: NotificationType, title: string, message: string, data: any = {}) => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: `[Floperia ${type.toUpperCase()}] ${title}`,
      html: buildAdminEmailHtml(type, title, message, data),
    })
  });

  const result = await response.json().catch(() => ({ success: false, error: 'Invalid email response' }));
  if (!response.ok || result.success === false) {
    throw new Error(typeof result?.error === 'string' ? result.error : 'Admin email failed');
  }

  return result;
};

export const sendPrivyrNotification = async (type: NotificationType, title: string, message: string, data: any = {}) => {
  const deliveryDetails = data.deliveryDetails as DeliveryDetails | undefined;
  const response = await fetch('/api/privyr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name || data.fullName || deliveryDetails?.fullName || 'New Lead',
      email: data.email || deliveryDetails?.email || '',
      phone: data.phone || deliveryDetails?.phone || '',
      lead_source: `Floperia - ${type.toUpperCase()}`,
      notes: buildPrivyrNotes(type, title, message, data),
    })
  });

  const result = await response.json().catch(() => ({ success: false, error: 'Invalid webhook response' }));
  if (!response.ok || result.success === false) {
    throw new Error(typeof result?.error === 'string' ? result.error : 'Privyr webhook failed');
  }

  return result;
};

export const createNotification = async (type: NotificationType, title: string, message: string, data: any = {}) => {
  let emailSuccess = false;
  let privyrSuccess = false;

  try {
    await addDoc(collection(db, 'notifications'), {
      type,
      title,
      message,
      data,
      read: false,
      createdAt: serverTimestamp()
    });

    try {
      await sendAdminEmailNotification(type, title, message, data);
      emailSuccess = true;
    } catch (emailError) {
      console.error('Admin email notification failed:', emailError);
    }

    try {
      await sendPrivyrNotification(type, title, message, data);
      privyrSuccess = true;
    } catch (privyrError) {
      console.error('Privyr notification failed:', privyrError);
    }

    return { success: true, emailSuccess, privyrSuccess };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, emailSuccess, privyrSuccess, error };
  }
};

export const subscribeToNotifications = (onUpdate: (notifications: AdminNotification[]) => void, max: number = 20) => {
  const q = query(
    collection(db, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(max)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
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
