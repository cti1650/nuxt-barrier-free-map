<template>
  <v-form @submit.prevent="submitBarrier" class="mb-4">
    <v-radio-group v-model="barrierType" label="バリアタイプ">
      <v-radio v-for="type in barrierTypes" :key="type.value" :label="type.label" :value="type.value" />
    </v-radio-group>
    <v-textarea v-model="description" label="詳細説明" />
    <v-text-field v-model.number="lat" label="緯度" type="number" step="0.000001" />
    <v-text-field v-model.number="lng" label="経度" type="number" step="0.000001" />
    <v-btn @click="getCurrentLocation" color="secondary" class="mb-2">現在地を取得</v-btn>
    <v-btn type="submit" color="primary" class="ml-2">{{ editingBarrier ? '更新' : '登録' }}</v-btn>
    <v-btn v-if="editingBarrier" @click="cancelEdit" color="error" class="ml-2">キャンセル</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBarrierStore } from '~/stores/barrier'
import { z } from 'zod'

const props = defineProps<{
  editingBarrier: Barrier | null
}>()

const barrierStore = useBarrierStore()

const barrierType = ref('')
const description = ref('')
const lat = ref(35.6762)
const lng = ref(139.6503)

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

const submitBarrier = () => {
  try {
    const validatedData: BarrierData = barrierSchema.parse({
      type: barrierType.value,
      description: description.value,
      lat: lat.value,
      lng: lng.value
    })
    if (props.editingBarrier) {
      barrierStore.updateBarrier({ ...props.editingBarrier, ...validatedData })
    } else {
      barrierStore.addBarrier(validatedData)
    }
    resetForm()
  } catch (error) {
    console.error('Validation error:', error)
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

watch(() => props.editingBarrier, (newBarrier) => {
  if (newBarrier) {
    barrierType.value = newBarrier.type
    description.value = newBarrier.description
    lat.value = newBarrier.lat
    lng.value = newBarrier.lng
  }
})

const emit = defineEmits(['cancel-edit'])
</script>