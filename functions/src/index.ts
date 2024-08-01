import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const createCustomToken = functions.https.onCall(async (data, context) => {
  // 注意: これは開発環境専用です。本番環境では適切な認証を行ってください。
  const uid = 'emulator-user-id'
  try {
    const customToken = await admin.auth().createCustomToken(uid)
    return { customToken }
  } catch (error) {
    console.error('Error creating custom token:', error)
    throw new functions.https.HttpsError('internal', 'Unable to create custom token')
  }
})