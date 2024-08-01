<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">ログイン</span>
      </v-card-title>
      <v-card-text>
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
        <v-btn variant="text" color="secondary" class="mt-2" @click="toggleMode">
          {{ isLogin ? '新規登録はこちら' : 'ログインはこちら' }}
        </v-btn>
        <v-divider class="my-4"></v-divider>
        <v-btn color="red" dark block @click="signInWithGoogle" :loading="isLoading">
          <v-icon left>mdi-google</v-icon>
          Googleでログイン
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const { $auth, $provideAuth } = useNuxtApp()

const dialog = ref(false)
const email = ref('')
const password = ref('')
const isLogin = ref(true)
const isLoading = ref(false)

const emit = defineEmits(['login-success', 'login-error'])

const submitForm = async () => {
  try {
    isLoading.value = true
    if (isLogin.value) {
      await signInWithEmailAndPassword($auth, email.value, password.value)
    } else {
      await createUserWithEmailAndPassword($auth, email.value, password.value)
    }
    emit('login-success')
    dialog.value = false
  } catch (error) {
    console.error('Authentication error:', error)
    emit('login-error', 'ログインに失敗しました。')
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
    emit('login-success')
    dialog.value = false
  } catch (error) {
    console.error('Google authentication error:', error)
    emit('login-error', 'Googleログインに失敗しました。')
  } finally {
    isLoading.value = false
  }
}

defineExpose({ dialog })
</script>