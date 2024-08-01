<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">バリアフリーマップ</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <GoogleMap />
      </v-col>
      <v-col cols="12" md="4">
        <BarrierForm />
        <BarrierList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import GoogleMap from '~/components/GoogleMap.vue'
import BarrierForm from '~/components/BarrierForm.vue'
import BarrierList from '~/components/BarrierList.vue'
</script>