import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

interface Barrier {
  id?: string;
  type: "slope" | "step" | "stairs";
  description: string;
  lat: number;
  lng: number;
}

export const useBarrierStore = defineStore("barrier", {
  state: () => ({
    barriers: [] as Barrier[],
  }),
  actions: {
    async fetchBarriers() {
      const { $db } = useNuxtApp();
      const querySnapshot = await getDocs(collection($db, "barriers"));
      this.barriers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Barrier, "id">),
      }));
    },
    async addBarrier(barrier: Omit<Barrier, "id">) {
      const { $db } = useNuxtApp();
      const docRef = await addDoc(collection($db, "barriers"), barrier);
      const newBarrier = { id: docRef.id, ...barrier };
      this.barriers.push(newBarrier);
      return newBarrier;
    },
    async updateBarrier(barrier: Barrier) {
      if (!barrier.id) throw new Error("Barrier ID is required for update");
      const { $db } = useNuxtApp();
      const barrierRef = doc($db, "barriers", barrier.id);

      const { id, ...updateData } = barrier;

      await updateDoc(barrierRef, updateData);

      const index = this.barriers.findIndex((b) => b.id === barrier.id);
      if (index !== -1) {
        this.barriers[index] = barrier;
      }
    },

    async deleteBarrier(id: string) {
      const { $db } = useNuxtApp();
      const barrierRef = doc($db, "barriers", id);
      await deleteDoc(barrierRef);
      this.barriers = this.barriers.filter((b) => b.id !== id);
    },
  },
});
