import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, type User, GoogleAuthProvider } from 'firebase/auth'
import { ref, readonly } from 'vue'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = config.public.firebaseConfig

  // Firebaseの初期化
  const app = initializeApp(firebaseConfig)

  // Firestoreの取得
  const db = getFirestore(app)

  // Authenticationの取得
  const auth = getAuth(app)

  // Google認証プロバイダーの初期化
  const googleProvider = new GoogleAuthProvider()

  // 現在のユーザー状態を管理
  const user = ref<User | null>(null)

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    console.log('Auth state changed:', currentUser ? 'Logged in' : 'Logged out')
  })

  return {
    provide: {
      db,
      auth,
      googleProvider,
      user: readonly(user)  // readonly を使用して外部からの直接的な変更を防ぐ
    }
  }
})