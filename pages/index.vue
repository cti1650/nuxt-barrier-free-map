<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>バリアフリーマップ</v-app-bar-title>
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
            <v-card elevation="2" class="mb-4">
              <v-card-title>バリア情報登録</v-card-title>
              <v-card-text>
                <BarrierForm 
                  :editing-barrier="editingBarrier" 
                  @cancel-edit="cancelEdit" 
                  @barrier-added="onBarrierAdded"
                />
              </v-card-text>
            </v-card>
            <BarrierList @center-map="centerMap" @edit-barrier="editBarrier" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <BarrierEditDialog :barrier="editingBarrier" @close="closeEditDialog" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GoogleMap from '~/components/GoogleMap.vue'
import BarrierForm from '~/components/BarrierForm.vue'
import BarrierList from '~/components/BarrierList.vue'
import BarrierEditDialog from '~/components/BarrierEditDialog.vue'
import { useBarrierStore } from '~/stores/barrier'

const barrierStore = useBarrierStore()
const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null)
const editingBarrier = ref<Barrier | null>(null)

onMounted(async () => {
  await barrierStore.fetchBarriers()
})

const centerMap = (barrier: Barrier) => {
  mapRef.value?.centerMapOnBarrier(barrier)
}

const editBarrier = (barrier: Barrier) => {
  editingBarrier.value = barrier
}

const cancelEdit = () => {
  editingBarrier.value = null
}

const closeEditDialog = () => {
  editingBarrier.value = null
}

const onBarrierAdded = () => {
  // バリア情報が追加されたときの処理
  // 必要に応じて追加のアクションを実行できます
}
</script>