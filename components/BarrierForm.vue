<template>
  <v-form @submit.prevent="submitBarrier">
    <v-radio-group v-model="barrierType" label="バリアタイプ" row>
      <v-radio v-for="type in barrierTypes" :key="type.value" :label="type.label" :value="type.value" />
    </v-radio-group>
    
    <v-textarea
      v-model="description"
      label="詳細説明"
      rows="3"
      auto-grow
      outlined
      dense
    />
    
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model.number="lat"
          label="緯度"
          type="number"
          step="0.000001"
          outlined
          dense
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="lng"
          label="経度"
          type="number"
          step="0.000001"
          outlined
          dense
        />
      </v-col>
    </v-row>
    
    <v-row class="mb-4">
      <v-col>
        <v-btn @click="getCurrentLocation" color="secondary" text>
          <v-icon left>mdi-crosshairs-gps</v-icon>
          現在地を取得
        </v-btn>
      </v-col>
      <v-col>
        <v-btn @click="getMapCenter" color="info" text>
          <v-icon left>mdi-map-marker</v-icon>
          マップ中央を使用
        </v-btn>
      </v-col>
    </v-row>
    
    <v-divider class="my-4"></v-divider>
    
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn
          v-if="editingBarrier"
          @click="cancelEdit"
          color="error"
          text
        >
          キャンセル
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
        >
          {{ editingBarrier ? '更新' : '登録' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBarrierStore } from '~/stores/barrier'
import { z } from 'zod'

const props = defineProps<{
  editingBarrier: Barrier | null,
  mapRef: any // GoogleMapコンポーネントの参照
}>()

const barrierStore = useBarrierStore()

const barrierType = ref('')
const description = ref('')
const lat = ref(35.6762)
const lng = ref(139.6503)
const isSubmitting = ref(false)

const barrierTypes = [
  { label: '坂道', value: 'slope' },
  { label: '段差', value: 'step' },
  { label: '階段', value: 'stairs' }
] as const

const barrierSchema = z.object({
  type: z.enum(['slope', 'step', 'stairs']),
  description: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
})

type BarrierData = z.infer<typeof barrierSchema>

const submitBarrier = async () => {
  try {
    isSubmitting.value = true
    const validatedData: BarrierData = barrierSchema.parse({
      type: barrierType.value,
      description: description.value,
      lat: lat.value,
      lng: lng.value
    })
    if (props.editingBarrier) {
      await barrierStore.updateBarrier({ ...props.editingBarrier, ...validatedData })
    } else {
      await barrierStore.addBarrier(validatedData)
    }
    resetForm()
    emit('barrier-added')
  } catch (error) {
    console.error('Validation error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  barrierType.value = ''
  description.value = ''
  lat.value = 35.6762
  lng.value = 139.6503
}

const cancelEdit = () => {
  resetForm()
  emit('cancel-edit')
}

const getCurrentLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude
      lng.value = position.coords.longitude
    }, (error) => {
      console.error("Error getting location:", error)
    })
  } else {
    console.error("Geolocation is not available in this browser.")
  }
}

const getMapCenter = () => {
  if (props.mapRef) {
    const center = props.mapRef.getCenterPosition()
    if (center) {
      lat.value = center.lat
      lng.value = center.lng
    }
  }
}

watch(() => props.editingBarrier, (newBarrier) => {
  if (newBarrier) {
    barrierType.value = newBarrier.type
    description.value = newBarrier.description
    lat.value = newBarrier.lat
    lng.value = newBarrier.lng
  }
})

const emit = defineEmits(['cancel-edit', 'barrier-added'])
</script>