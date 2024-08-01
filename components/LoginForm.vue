<template>
  <v-card class="pa-4">
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="email"
        label="メールアドレス"
        type="email"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="パスワード"
        type="password"
        required
      ></v-text-field>
      <v-btn type="submit" color="primary" block class="mt-4" :loading="isLoading">
        {{ isLogin ? 'ログイン' : '新規登録' }}
      </v-btn>
    </v-form>
    <v-btn text color="secondary" class="mt-2" @click="toggleMode">
      {{ isLogin ? '新規登録はこちら' : 'ログインはこちら' }}
    </v-btn>
    <v-divider class="my-4"></v-divider>
    <v-btn color="red" dark block @click="signInWithGoogle" :loading="isLoading">
      <v-icon left>mdi-google</v-icon>
      Googleでログイン
    </v-btn>
    <v-snackbar v-model="showError" color="error" :timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth'

const { $auth, $provideAuth } = useNuxtApp()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const isLoading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const submitForm = async () => {
  try {
    isLoading.value = true
    if (isLogin.value) {
      await signInWithEmailAndPassword($auth, email.value, password.value)
    } else {
      await createUserWithEmailAndPassword($auth, email.value, password.value)
    }
    console.log('Email/Password authentication successful')
  } catch (error: any) {
    console.error('Authentication error:', error)
    errorMessage.value = 'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const signInWithGoogle = async () => {
  try {
    isLoading.value = true
    if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
      await $provideAuth.emulatorGoogleSignIn()
    } else {
      await $provideAuth.googleSignIn()
    }
    console.log('Google authentication successful')
  } catch (error) {
    console.error('Google authentication error:', error)
    errorMessage.value = 'Googleログインに失敗しました。もう一度お試しください。'
    showError.value = true
  } finally {
    isLoading.value = false
  }
}

// リダイレクト認証の結果を確認
onMounted(async () => {
  try {
    const result = await getRedirectResult($auth)
    if (result) {
      console.log('Redirect authentication successful')
    }
  } catch (error) {
    console.error('Redirect authentication error:', error)
    errorMessage.value = 'Googleログインに失敗しました。もう一度お試しください。'
    showError.value = true
  }
})
</script>