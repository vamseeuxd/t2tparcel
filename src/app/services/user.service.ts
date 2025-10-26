import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, Timestamp, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collectionName = 'users';

  constructor(private firestore: Firestore) {}

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userData = {
      ...user,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(this.firestore, this.collectionName), userData);
    return docRef.id;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    await deleteDoc(userRef);
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data['createdAt']?.toDate(),
        updatedAt: data['updatedAt']?.toDate()
      } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data['createdAt']?.toDate(),
        updatedAt: data['updatedAt']?.toDate()
      } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('role', '==', role)
    );
    
    return new Observable(observer => {
      return onSnapshot(q, (snapshot: any) => {
        const users = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        })) as User[];
        observer.next(users);
      });
    });
  }

  getAllUsers(): Observable<User[]> {
    return new Observable(observer => {
      return onSnapshot(collection(this.firestore, this.collectionName), (snapshot: any) => {
        const users = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        })) as User[];
        observer.next(users);
      });
    });
  }
}