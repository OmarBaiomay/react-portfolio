import {
  sendMultipleNotifications,
  sendTopicNotification,
} from '../lib/notification.js';
import { query } from '../db/pg-connection.js';

export const sendToUser = async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ message: 'userId, title, and body are required' });
    }

    const result = await query(`SELECT fcm_tokens FROM users WHERE id = $1`, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fcmTokens = user.fcm_tokens || [];
    if (fcmTokens.length === 0) {
      return res.status(400).json({ message: 'User has no FCM tokens registered' });
    }

    const notifyResult = await sendMultipleNotifications(fcmTokens, title, body, data);

    res.status(200).json({
      message: 'Notification sent successfully',
      result: notifyResult,
    });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendToAllAdmins = async (req, res) => {
  try {
    const { title, body, data } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'title and body are required' });
    }

    const result = await query(`SELECT fcm_tokens FROM users WHERE role = 'admin'`);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    const fcmTokens = result.rows.flatMap((admin) => admin.fcm_tokens || []);
    if (fcmTokens.length === 0) {
      return res.status(400).json({ message: 'No FCM tokens found for admins' });
    }

    const notifyResult = await sendMultipleNotifications(fcmTokens, title, body, data);

    res.status(200).json({
      message: 'Notifications sent to all admins',
      result: notifyResult,
    });
  } catch (error) {
    console.error('Error sending notifications:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendToTopic = async (req, res) => {
  try {
    const { topic, title, body, data } = req.body;

    if (!topic || !title || !body) {
      return res.status(400).json({ message: 'topic, title, and body are required' });
    }

    const notifyResult = await sendTopicNotification(topic, title, body, data);

    res.status(200).json({
      message: 'Topic notification sent successfully',
      result: notifyResult,
    });
  } catch (error) {
    console.error('Error sending topic notification:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
