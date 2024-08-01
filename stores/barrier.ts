import { defineStore } from 'pinia'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '~/plugins/firebase'

interface Barrier {
  id?: string
  type: 'slope' | 'step' | 'stairs'
  description: string
  lat: number
  lng: number
}

export const useBarrierStore = defineStore('barrier', {
  state: () => ({
    barriers: [] as Barrier[]
  }),
  actions: {
    async fetchBarriers() {
      const querySnapshot = await getDocs(collection(db, 'barriers'))
      this.barriers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Barrier, 'id'>)
      }))
    },
    async addBarrier(barrier: Omit<Barrier, 'id'>) {
      const docRef = await addDoc(collection(db, 'barriers'), barrier)
      this.barriers.push({ id: docRef.id, ...barrier })
    }
  }
})