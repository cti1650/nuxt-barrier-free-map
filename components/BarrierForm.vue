<template>
  <v-form @submit.prevent="submitBarrier" class="mb-4">
    <v-radio-group v-model="barrierType" label="バリアタイプ">
      <v-radio v-for="type in barrierTypes" :key="type.value" :label="type.label" :value="type.value" />
    </v-radio-group>
    <v-textarea v-model="description" label="詳細説明" />
    <v-btn type="submit" color="primary">登録</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBarrierStore } from '~/stores/barrier'
import { z } from 'zod'

const barrierStore = useBarrierStore()

const barrierType = ref<string>('')
const description = ref<string>('')

const barrierTypes = [
  { label: '坂道', value: 'slope' },
  { label: '段差', value: 'step' },
  { label: '階段', value: 'stairs' }
] as const

const barrierSchema = z.object({
  type: z.enum(['slope', 'step', 'stairs']),
  description: z.string().min(1).max(200)
})

type BarrierData = z.infer<typeof barrierSchema>

const submitBarrier = () => {
  try {
    const validatedData: BarrierData = barrierSchema.parse({
      type: barrierType.value,
      description: description.value
    })
    barrierStore.addBarrier({
      ...validatedData,
      lat: Math.random() * (35.7 - 35.6) + 35.6,
      lng: Math.random() * (139.8 - 139.6) + 139.6
    })
    barrierType.value = ''
    description.value = ''
  } catch (error) {
    console.error('Validation error:', error)
  }
}
</script>