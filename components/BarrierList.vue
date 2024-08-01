<template>
  <v-card class="ma-2">
    <v-card-title>登録されたバリア情報</v-card-title>
    <v-list>
      <v-list-item
        v-for="barrier in barrierStore.barriers"
        :key="barrier.id"
        @click="$emit('center-map', barrier)"
      >
        <v-list-item-title>
          <strong>{{ getBarrierTypeLabel(barrier.type) }}</strong>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ barrier.description }}
        </v-list-item-subtitle>
        <template v-slot:append>
          <v-btn icon="mdi-pencil" size="small" @click.stop="$emit('edit-barrier', barrier)"></v-btn>
          <v-btn icon="mdi-delete" size="small" @click.stop="confirmDelete(barrier)"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>バリア情報の削除</v-card-title>
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

const confirmDelete = (barrier: Barrier) => {
  barrierToDelete.value = barrier
  deleteDialog.value = true
}

const deleteBarrier = async () => {
  if (barrierToDelete.value && barrierToDelete.value.id) {
    isDeleting.value = true
    try {
      await barrierStore.deleteBarrier(barrierToDelete.value.id)
      // 削除後にマップの更新フラグを明示的に設定
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