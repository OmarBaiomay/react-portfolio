import { getFirebaseAdmin } from './firebase.js';

function requireMessaging() {
  const admin = getFirebaseAdmin();
  if (!admin) {
    throw new Error('Firebase is not configured');
  }
  return admin.messaging();
}

export const sendNotification = async (fcmToken, title, body, data = {}) => {
  try {
    const response = await requireMessaging().send({
      notification: { title, body },
      data,
      token: fcmToken,
    });
    return { success: true, response };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

export const sendMultipleNotifications = async (fcmTokens, title, body, data = {}) => {
  try {
    const response = await requireMessaging().sendEachForMulticast({
      notification: { title, body },
      data,
      tokens: fcmTokens,
    });
    return { success: true, response };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { success: false, error: error.message };
  }
};

export const sendTopicNotification = async (topic, title, body, data = {}) => {
  try {
    const response = await requireMessaging().send({
      notification: { title, body },
      data,
      topic,
    });
    return { success: true, response };
  } catch (error) {
    console.error('Error sending topic notification:', error);
    return { success: false, error: error.message };
  }
};
