import { Injectable } from '@angular/core';
import { Database, ref, set, get, update, remove, child, push } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: Database) {}

  async getAllData() {
    const dbRef = ref(this.db, 'texts/')
    const snapshot = await get(dbRef)
    if (snapshot.exists()) {
      console.log(snapshot.val())
      return snapshot.val()
    }
  }

  async createData(data: { text: string, lang: string }) {
    const newRef = push(ref(this.db, 'texts/'));
    await set(newRef, data);
    return newRef.key;
  }

  async readData(uuid: string) {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, `texts/${uuid}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  }

  async updateData(uuid: string, data: { text: string, lang: string }) {
    const updates: any = {};
    updates[`texts/${uuid}`] = data;
    await update(ref(this.db), updates);
    this.readData(uuid)
  }

  async deleteData(uuid: string) {
    await remove(ref(this.db, `texts/${uuid}`));
    return true
  }
}
