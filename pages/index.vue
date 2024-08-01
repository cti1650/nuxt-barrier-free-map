<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>バリアフリーマップ</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="isAuthenticated" @click="logout" text>ログアウト</v-btn>
      <v-btn v-else @click="openLoginModal" text>ログイン</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8">
            <v-card elevation="2" class="mb-4">
              <GoogleMap ref="mapRef" />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card v-if="isAuthenticated" elevation="2" class="mb-4">
              <v-card-title>バリア情報登録</v-card-title>
              <v-card-text>
                <BarrierForm 
                  :editing-barrier="editingBarrier" 
                  :map-ref="mapRef"
                  @cancel-edit="cancelEdit" 
                  @barrier-added="onBarrierAdded"
                />
              </v-card-text>
            </v-card>
            <v-card elevation="2" class="mb-4">
              <v-card-title>登録されたバリア情報</v-card-title>
              <v-card-text>
                <BarrierList @center-map="centerMap" @edit-barrier="editBarrier" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <BarrierEditDialog :barrier="editingBarrier" @close="closeEditDialog" />
    <LoginModal ref="loginModalRef" @login-success="onLoginSuccess" @login-error="onLoginError" />
    
    <v-snackbar v-model="showError" color="error" :timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNuxtApp } from '#app'
import { signOut } from 'firebase/auth'
import GoogleMap from '~/components/GoogleMap.vue'
import BarrierForm from '~/components/BarrierForm.vue'
import BarrierList from '~/components/BarrierList.vue'
import BarrierEditDialog from '~/components/BarrierEditDialog.vue'
import LoginModal from '~/components/LoginModal.vue'
import { useBarrierStore } from '~/stores/barrier'

const { $auth, $user } = useNuxtApp()
const barrierStore = useBarrierStore()
const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null)
const editingBarrier = ref<Barrier | null>(null)
const loginModalRef = ref<InstanceType<typeof LoginModal> | null>(null)
const showError = ref(false)
const errorMessage = ref('')

const isAuthenticated = computed(() => $user.value !== null)

watch($user, (newUser) => {
  console.log('User state changed:', newUser ? 'Logged in' : 'Logged out')
  if (newUser) {
    console.log('User details:', newUser.displayName, newUser.email)
  }
})

const centerMap = (barrier: Barrier) => {
  mapRef.value?.centerMapOnBarrier(barrier)
}

const editBarrier = (barrier: Barrier) => {
  if (isAuthenticated.value) {
    editingBarrier.value = barrier
  } else {
    showError.value = true
    errorMessage.value = 'バリア情報の編集にはログインが必要です。'
  }
}

const cancelEdit = () => {
  editingBarrier.value = null
}

const closeEditDialog = () => {
  editingBarrier.value = null
}

const onBarrierAdded = () => {
  console.log('Barrier added')
  // バリア追加後の処理（例：リストの更新）
  barrierStore.fetchBarriers()
}

const logout = async () => {
  try {
    await signOut($auth)
    console.log('Logout successful')
  } catch (error) {
    console.error('Logout error:', error)
    showError.value = true
    errorMessage.value = 'ログアウトに失敗しました。'
  }
}

const openLoginModal = () => {
  if (loginModalRef.value) {
    loginModalRef.value.dialog = true
  }
}

const onLoginSuccess = () => {
  console.log('Login successful')
  // ログイン成功後の処理（例：バリア情報の再取得）
  barrierStore.fetchBarriers()
}

const onLoginError = (error: string) => {
  showError.value = true
  errorMessage.value = error
}

// コンポーネントのマウント時にバリア情報を取得
onMounted(() => {
  barrierStore.fetchBarriers()
})
</script>