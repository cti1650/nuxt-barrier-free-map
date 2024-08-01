<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">バリアフリーマップ</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <GoogleMap ref="mapRef" />
      </v-col>
      <v-col cols="12" md="4">
        <BarrierForm :editing-barrier="editingBarrier" @cancel-edit="cancelEdit" />
        <BarrierList @center-map="centerMap" @edit-barrier="editBarrier" />
      </v-col>
    </v-row>
    <BarrierEditDialog :barrier="editingBarrier" @close="closeEditDialog" />
  </v-container>
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
</script>