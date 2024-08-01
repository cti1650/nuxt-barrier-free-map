import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { 
  getAuth, 
  connectAuthEmulator, 
  onAuthStateChanged, 
  type User, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithCustomToken,
  type Auth
} from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { ref, readonly } from 'vue'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseConfig.apiKey,
    authDomain: config.public.firebaseConfig.authDomain,
    projectId: config.public.firebaseConfig.projectId,
    storageBucket: config.public.firebaseConfig.storageBucket,
    messagingSenderId: config.public.firebaseConfig.messagingSenderId,
    appId: config.public.firebaseConfig.appId
  }

  // Firebaseの初期化
  const app = initializeApp(firebaseConfig)

  // Firestoreの取得
  const db = getFirestore(app)

  // Authenticationの取得
  const auth: Auth = getAuth(app)

  // Cloud Functionsの取得
  const functions = getFunctions(app)

  // Cloud Storageの取得
  const storage = getStorage(app)

  // GoogleAuthProviderの初期化
  const googleProvider = new GoogleAuthProvider()

  // 開発環境の場合、エミュレータに接続
  if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFunctionsEmulator(functions, 'localhost', 5001)
    connectStorageEmulator(storage, 'localhost', 9199)
    console.log('Connected to Firebase Emulators')
  }

  // 現在のユーザー状態を管理
  const user = ref<User | null>(null)

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    console.log('Auth state changed:', currentUser ? 'Logged in' : 'Logged out')
  })

  // 認証関連の関数を提供
  const provideAuth = {
    googleSignIn: async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        return result.user
      } catch (error) {
        console.error('Google Sign In Error:', error)
        throw error
      }
    },
    // エミュレータ用のカスタムログイン
    emulatorGoogleSignIn: async () => {
      if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
        try {
          const createCustomToken = httpsCallable(functions, 'createCustomToken')
          const result = await createCustomToken()
          const { customToken } = result.data as { customToken: string }
          const userCredential = await signInWithCustomToken(auth, customToken)
          return userCredential.user
        } catch (error) {
          console.error('Emulator Google Sign In Error:', error)
          throw error
        }
      } else {
        return provideAuth.googleSignIn()
      }
    }
  }

  return {
    provide: {
      db,
      auth,
      functions,
      storage,
      user: readonly(user),
      provideAuth,
      googleProvider  // 明示的に GoogleAuthProvider を提供
    }
  }
})