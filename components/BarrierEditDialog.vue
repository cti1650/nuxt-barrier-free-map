<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">バリア情報の編集</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="editedBarrier.type"
                :items="barrierTypes"
                item-title="text"
                item-value="value"
                label="バリアタイプ"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedBarrier.description"
                label="詳細説明"
                required
              ></v-textarea>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="editedBarrier.lat"
                label="緯度"
                type="number"
                step="0.000001"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="editedBarrier.lng"
                label="経度"
                type="number"
                step="0.000001"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="save" :loading="isSaving">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBarrierStore } from '~/stores/barrier'

const props = defineProps<{
  barrier: Barrier | null
}>()

const barrierStore = useBarrierStore()
const dialog = ref(false)
const isSaving = ref(false)
const editedBarrier = ref<Barrier>({
  id: '',
  type: 'slope',
  description: '',
  lat: 35.6762,
  lng: 139.6503
})

const barrierTypes = [
  { text: '坂道', value: 'slope' },
  { text: '段差', value: 'step' },
  { text: '階段', value: 'stairs' }
]

watch(() => props.barrier, (newBarrier) => {
  if (newBarrier) {
    editedBarrier.value = { ...newBarrier }
    dialog.value = true
  }
})

const close = () => {
  dialog.value = false
  emit('close')
}

const save = async () => {
  isSaving.value = true
  try {
    await barrierStore.updateBarrier(editedBarrier.value)
    close()
  } catch (error) {
    console.error('Error updating barrier:', error)
  } finally {
    isSaving.value = false
  }
}

const emit = defineEmits(['close'])
</script>