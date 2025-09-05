import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, where, getDocs, query } from '@angular/fire/firestore';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentRole: string | null = null;
  private loading = true;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    // Restaurar sesión
    onAuthStateChanged(this.auth, async (user) => {
      console.log(user);
      if (user) {
        console.log('por aqui')
        this.currentUser = user;
        await this.loadUserRole(user.email!);
        localStorage.setItem('user', user.email!);
      } else {
        this.currentUser = null;
        this.currentRole = null;
        localStorage.removeItem('user');
      }
      this.loading = false;
    });

    // Si ya había sesión guardada en localStorage, intentar restaurar
    const savedEmail = localStorage.getItem('user');
    if (savedEmail) {
      this.loadUserRole(savedEmail);
    }
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email + "@gmail.com", password);
    this.currentUser = cred.user;
    await this.loadUserRole(cred.user.email!);
    localStorage.setItem('user', cred.user.email!);
    return cred;
  }

  async register(email: string, password: string, role: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email + "@gmail.com", password);
    const user = userCredential.user;

    // Guardar datos y rol en Firestore
    await setDoc(doc(this.firestore, 'users', user.uid), {
      email: user.email,
      role: role
    });

    return user;
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser = null;
    this.currentRole = null;
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  async loadUserRole(email: string) {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as any;
      this.currentRole = data.role || null;
      localStorage.setItem("role", this.currentRole ?? "");
    }
  }

  // 🔹 Métodos simples para consultar estado
  isLoading(): boolean {
    return this.loading;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("user");
  }

  getUser(): string {
    return localStorage.getItem("user")?.replace("@gmail.com", "") ?? "";
  }

  getRole(): string | null {
    return localStorage.getItem("role");
  }

  
}

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.getRole() === 'admin') {
    return true;
  } else {
    router.navigate(['/vender']);// redirige al empleado solo a ventas
    return false;
  }
};


export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    console.log("entra por aqui 2")
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

