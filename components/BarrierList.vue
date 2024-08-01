<template>
  <v-card class="ma-2">
    <v-card-title>
      <v-icon left>mdi-format-list-bulleted</v-icon>
      登録されたバリア情報
    </v-card-title>
    <v-list>
      <v-list-item
        v-for="barrier in barrierStore.barriers"
        :key="barrier.id"
        @click="$emit('center-map', barrier)"
        class="mb-2"
      >
        <div class="d-flex align-center w-100">
          <v-icon :color="getBarrierTypeColor(barrier.type)" class="mr-3">
            {{ getBarrierTypeIcon(barrier.type) }}
          </v-icon>
          
          <div class="flex-grow-1">
            <div class="font-weight-medium">{{ getBarrierTypeLabel(barrier.type) }}</div>
            <div class="text-caption">{{ barrier.description }}</div>
          </div>
          
          <div class="ml-auto">
            <v-btn icon small @click.stop="$emit('edit-barrier', barrier)" class="mr-2">
              <v-icon color="grey lighten-1">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click.stop="confirmDelete(barrier)">
              <v-icon color="grey lighten-1">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title class="headline">バリア情報の削除</v-card-title>
        <v-card-text>本当にこのバリア情報を削除しますか？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteBarrier" :loading="isDeleting">削除</v-btn>
          <v-btn color="primary" text @click="deleteDialog = false">キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBarrierStore } from '~/stores/barrier'

const barrierStore = useBarrierStore()

const deleteDialog = ref(false)
const isDeleting = ref(false)
const barrierToDelete = ref<Barrier | null>(null)

const getBarrierTypeLabel = (type: string): string => {
  const types: { [key: string]: string } = {
    slope: '坂道',
    step: '段差',
    stairs: '階段'
  }
  return types[type] || type
}

const getBarrierTypeIcon = (type: string): string => {
  const icons: { [key: string]: string } = {
    slope: 'mdi-slope-uphill',
    step: 'mdi-stairs',
    stairs: 'mdi-stairs'
  }
  return icons[type] || 'mdi-alert-circle'
}

const getBarrierTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    slope: 'orange',
    step: 'blue',
    stairs: 'purple'
  }
  return colors[type] || 'grey'
}

const confirmDelete = (barrier: Barrier) => {
  barrierToDelete.value = barrier
  deleteDialog.value = true
}

const deleteBarrier = async () => {
  if (barrierToDelete.value && barrierToDelete.value.id) {
    isDeleting.value = true
    try {
      await barrierStore.deleteBarrier(barrierToDelete.value.id)
      barrierStore.$patch({ mapNeedsUpdate: true })
    } catch (error) {
      console.error('Error deleting barrier:', error)
    } finally {
      isDeleting.value = false
      deleteDialog.value = false
      barrierToDelete.value = null
    }
  }
}

defineEmits(['center-map', 'edit-barrier'])
</script>