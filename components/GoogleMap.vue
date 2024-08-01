<template>
  <div>
    <div ref="mapElement" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { useBarrierStore } from '~/stores/barrier'
import { useRuntimeConfig } from '#app'

const mapElement = ref<HTMLElement | null>(null)
const barrierStore = useBarrierStore()
const map = ref<google.maps.Map | null>(null)
const markers = ref<{[key: string]: google.maps.Marker}>({})
const infoWindow = ref<google.maps.InfoWindow | null>(null)

const initMap = async () => {
  if (!mapElement.value) return

  const config = useRuntimeConfig()
  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    version: 'weekly'
  })

  const google = await loader.load()
  map.value = new google.maps.Map(mapElement.value, {
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 13
  })

  infoWindow.value = new google.maps.InfoWindow()

  updateMarkers()
}

const updateMarkers = () => {
  if (!map.value) return

  // Remove all existing markers
  Object.values(markers.value).forEach(marker => marker.setMap(null))
  markers.value = {}

  // Add new markers
  barrierStore.barriers.forEach(barrier => {
    if (!barrier.id) return
    const marker = new google.maps.Marker({
      position: { lat: barrier.lat, lng: barrier.lng },
      map: map.value,
      title: barrier.type
    })

    marker.addListener('click', () => {
      if (!infoWindow.value) return
      infoWindow.value.setContent(`
        <h3>${barrier.type}</h3>
        <p>${barrier.description}</p>
      `)
      infoWindow.value.open(map.value, marker)
    })

    markers.value[barrier.id] = marker
  })
}

const centerMapOnBarrier = (barrier: { lat: number; lng: number }) => {
  if (!map.value) return
  map.value.setCenter({ lat: barrier.lat, lng: barrier.lng })
  map.value.setZoom(15)
}

onMounted(async () => {
  await initMap()
})

watch(() => barrierStore.barriers, updateMarkers, { deep: true })

defineExpose({ centerMapOnBarrier })
</script>