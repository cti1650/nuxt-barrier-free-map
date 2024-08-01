import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics"
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const firebaseConfig = config.public.firebaseConfig

// Firebaseの初期化
const app = initializeApp(firebaseConfig)

// Firestoreの取得
export const db = getFirestore(app)

// Analyticsの取得
export const analytics = getAnalytics(app);