<template>
  <v-card class="ma-2">
    <v-card-title>登録されたバリア情報</v-card-title>
    <v-list>
      <v-list-item
        v-for="barrier in barrierStore.barriers"
        :key="barrier.id"
        @click="$emit('center-map', barrier)"
        style="cursor: pointer;"
      >
        <v-list-item-title>
          <strong>{{ getBarrierTypeLabel(barrier.type) }}</strong>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ barrier.description }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useBarrierStore } from '~/stores/barrier'

const barrierStore = useBarrierStore()

const getBarrierTypeLabel = (type: string): string => {
  const types: { [key: string]: string } = {
    slope: '坂道',
    step: '段差',
    stairs: '階段'
  }
  return types[type] || type
}

defineEmits(['center-map'])
</script>