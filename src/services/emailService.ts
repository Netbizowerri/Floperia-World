import { createNotification } from './notificationService';

export const sendAdminNotification = async (subject: string, html: string) => {
  // Redirect legacy calls to the new Notification + Privyr system
  return await createNotification(
    'contact', // Default type for legacy calls
    subject,
    "Legacy notification received. Check details for HTML content.",
    { html, subject }
  );
};
