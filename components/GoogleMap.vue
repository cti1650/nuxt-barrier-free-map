<template>
  <v-card class="ma-2">
    <v-card-title>バリアフリーマップ</v-card-title>
    <div ref="mapElement" style="width: 100%; height: 500px;"></div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { useBarrierStore } from '~/stores/barrier'
import { useRuntimeConfig } from '#app'

const mapElement = ref<HTMLElement | null>(null)
const barrierStore = useBarrierStore()

onMounted(async () => {
  if (!mapElement.value) return

  const config = useRuntimeConfig()
  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    version: 'weekly'
  })

  const google = await loader.load()
  const map = new google.maps.Map(mapElement.value, {
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 13
  })

  barrierStore.barriers.forEach(barrier => {
    new google.maps.Marker({
      position: { lat: barrier.lat, lng: barrier.lng },
      map: map,
      title: barrier.type
    })
  })
})
</script>