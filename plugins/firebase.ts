import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = config.public.firebaseConfig

  // Firebaseの初期化
  const app = initializeApp(firebaseConfig)

  // Firestoreの取得
  const db = getFirestore(app)

  return {
    provide: {
      db
    }
  }
})