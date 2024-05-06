import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        // Dopo il login con successo, recupera e stampa le informazioni dell'utente e il token
        const user = this.authService.getUser();
        const token = this.authService.getToken();
        console.log('User:', user);
        console.log('Token:', token);
        this.router.navigate(['/dashboard']);
      },
      (error: any) => {
        alert('Login failed');
      }
    );
  }
}
