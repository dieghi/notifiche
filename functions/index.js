const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

exports.syncDeviceState = onCall(
  {
    region: 'europe-west1',
    cors: true
  },
  async (request) => {
    const { registration, subscriptions } = request.data || {};

    if (!registration?.deviceId || !registration?.nickname) {
      throw new HttpsError(
        'invalid-argument',
        'registration.deviceId e registration.nickname sono obbligatori.'
      );
    }

    if (!Array.isArray(subscriptions)) {
      throw new HttpsError('invalid-argument', 'subscriptions deve essere un array.');
    }

    const safeSubscriptions = subscriptions.map((subscription) => ({
      id: String(subscription.id || ''),
      deviceId: String(subscription.deviceId || registration.deviceId),
      channelCode: String(subscription.channelCode || '').trim().toUpperCase(),
      role: subscription.role === 'sender' ? 'sender' : 'receiver',
      joinedAt: String(subscription.joinedAt || new Date().toISOString())
    }));

    const sanitizedRegistration = {
      deviceId: String(registration.deviceId),
      nickname: String(registration.nickname).trim(),
      fcmToken: registration.fcmToken ? String(registration.fcmToken) : null,
      platform: String(registration.platform || 'web'),
      notificationPermission:
        registration.notificationPermission === 'granted' ||
        registration.notificationPermission === 'denied' ||
        registration.notificationPermission === 'unsupported'
          ? registration.notificationPermission
          : 'default',
      isPwaInstalled: Boolean(registration.isPwaInstalled),
      onboardingCompleted: Boolean(registration.onboardingCompleted),
      createdAt: String(registration.createdAt || new Date().toISOString()),
      updatedAt: String(registration.updatedAt || new Date().toISOString())
    };

    const batch = db.batch();

    const deviceRef = db.collection('deviceRegistrations').doc(sanitizedRegistration.deviceId);
    batch.set(
      deviceRef,
      {
        ...sanitizedRegistration,
        subscriptions: safeSubscriptions.map((subscription) => ({
          id: subscription.id,
          channelCode: subscription.channelCode,
          role: subscription.role,
          joinedAt: subscription.joinedAt
        })),
        syncedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    safeSubscriptions.forEach((subscription) => {
      const subscriptionRef = db.collection('channelSubscriptions').doc(subscription.id);
      batch.set(
        subscriptionRef,
        {
          ...subscription,
          nickname: sanitizedRegistration.nickname,
          fcmToken: sanitizedRegistration.fcmToken,
          notificationPermission: sanitizedRegistration.notificationPermission,
          platform: sanitizedRegistration.platform,
          updatedAt: sanitizedRegistration.updatedAt,
          syncedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    });

    await batch.commit();

    return {
      success: true,
      syncedSubscriptions: safeSubscriptions.length
    };
  }
);

exports.sendChannelNotification = onCall(
  {
    region: 'europe-west1',
    cors: true
  },
  async (request) => {
    const { channelCode, title, body, senderDeviceId, senderNickname } = request.data || {};

    if (!channelCode || !title || !body) {
      throw new HttpsError('invalid-argument', 'channelCode, title e body sono obbligatori.');
    }

    const trimmedTitle = String(title).trim();
    const trimmedBody = String(body).trim();
    const trimmedChannelCode = String(channelCode).trim().toUpperCase();
    const trimmedSenderNickname = String(senderNickname || 'Sender').trim();

    if (!trimmedTitle || !trimmedBody) {
      throw new HttpsError('invalid-argument', 'Titolo e messaggio non possono essere vuoti.');
    }

    const subscriptionsSnapshot = await db
      .collection('channelSubscriptions')
      .where('channelCode', '==', trimmedChannelCode)
      .where('role', '==', 'receiver')
      .get();

    const tokens = subscriptionsSnapshot.docs
      .map((doc) => doc.data())
      .filter((subscription) => subscription.notificationPermission === 'granted')
      .map((subscription) => subscription.fcmToken)
      .filter((token) => typeof token === 'string' && token.length > 0);

    if (tokens.length === 0) {
      throw new HttpsError(
        'failed-precondition',
        'Nessun receiver con token valido trovato per questo canale.'
      );
    }

    const notificationRef = db.collection('notifications').doc();

    await notificationRef.set({
      id: notificationRef.id,
      channelCode: trimmedChannelCode,
      title: trimmedTitle,
      body: trimmedBody,
      createdAt: FieldValue.serverTimestamp(),
      senderNickname: trimmedSenderNickname,
      senderDeviceId: senderDeviceId || null,
      type: 'channel-message'
    });

    const sendResult = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: trimmedTitle,
        body: trimmedBody
      },
      data: {
        channelCode: trimmedChannelCode,
        notificationId: notificationRef.id,
        deepLink: `/notifiche/#/channels/${trimmedChannelCode}`,
        type: 'channel-message'
      },
      webpush: {
        notification: {
          icon: 'https://dieghi.github.io/notifiche/icons/icon-192.svg',
          badge: 'https://dieghi.github.io/notifiche/icons/icon-192.svg'
        },
        fcmOptions: {
          link: `https://dieghi.github.io/notifiche/#/channels/${trimmedChannelCode}`
        }
      }
    });

    return {
      success: true,
      sentCount: sendResult.successCount,
      storedNotificationId: notificationRef.id,
      failureCount: sendResult.failureCount
    };
  }
);
