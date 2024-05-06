import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private user: any | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/api/auth/login', { username, password })
      .pipe(
        tap((response: any) => {
          // Salva il token e le informazioni dell'utente nel localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          // Aggiorna le proprietà private
          this.token = response.token;
          this.user = response.user;
        })
      );
  }

  isLoggedIn(): boolean {
    // Verifica se il token è presente nel localStorage o in un altro luogo
    return !!localStorage.getItem('token');
  }

  getUser(): any | null {
    // Ottieni le informazioni dell'utente dal localStorage
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  getToken(): string | null {
    // Ottieni il token dal localStorage
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    // Verifica se l'utente è autenticato controllando la presenza del token
    return !!this.token;
  }

  logout(): void {
    // Rimuovi il token e le informazioni dell'utente dal localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reimposta le proprietà private
    this.token = null;
    this.user = null;
  }
}
