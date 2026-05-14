import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  showLogin    = signal(false);
  showRegister = signal(false);

  // Login fields
  loginUsername = '';
  loginPassword = '';
  loginError: string | null = null;
  loginLoading = false;

  // Register fields
  regUsername  = '';
  regEmail    = '';
  regFirstName = '';
  regLastName  = '';
  regPassword  = '';
  regPassword2 = '';
  regError: string | null = null;
  regSuccess: string | null = null;
  regLoading = false;

  constructor(private auth: AuthService, private router: Router, private cart: CartService) {}

  get user() { return this.auth.user(); }
  get isAdmin() { return this.auth.isAdmin(); }
  get cartCount() { return this.cart.totalItems(); }
  get userDisplayName(): string {
    if (!this.user) return '';
    const name = `${this.user.first_name} ${this.user.last_name}`.trim();
    return name || this.user.username;
  }

  get userAvatar(): string {
    const name = this.userDisplayName || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2dd4a8&color=0a0a0a&bold=true`;
  }

  toggleLogin()    { this.showLogin.update(v => !v); this.showRegister.set(false); this.clearErrors(); }
  toggleRegister() { this.showRegister.update(v => !v); this.showLogin.set(false); this.clearErrors(); }
  closeAll()       { this.showLogin.set(false); this.showRegister.set(false); this.clearErrors(); }

  private clearErrors() {
    this.loginError = null;
    this.regError = null;
    this.regSuccess = null;
  }

  onLogin() {
    if (!this.loginUsername.trim() || !this.loginPassword.trim()) {
      this.loginError = 'Completa todos los campos';
      return;
    }
    this.loginLoading = true;
    this.loginError = null;
    this.auth.login(this.loginUsername.trim(), this.loginPassword).subscribe({
      next: () => {
        this.loginUsername = '';
        this.loginPassword = '';
        this.loginLoading = false;
        this.closeAll();
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        this.loginError = err.error?.error || 'Usuario o contraseña incorrectos';
        this.loginLoading = false;
      }
    });
  }

  onRegister() {
    if (!this.regUsername.trim() || !this.regEmail.trim() ||
        !this.regFirstName.trim() || !this.regLastName.trim() ||
        !this.regPassword || !this.regPassword2) {
      this.regError = 'Completa todos los campos';
      return;
    }
    if (this.regPassword !== this.regPassword2) {
      this.regError = 'Las contraseñas no coinciden';
      return;
    }
    if (this.regPassword.length < 6) {
      this.regError = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    this.regLoading = true;
    this.regError = null;
    this.auth.register({
      username: this.regUsername.trim(),
      email: this.regEmail.trim(),
      first_name: this.regFirstName.trim(),
      last_name: this.regLastName.trim(),
      password: this.regPassword,
      password2: this.regPassword2,
    }).subscribe({
      next: () => {
        this.regSuccess = '¡Cuenta creada! Redireccionando...';
        this.regLoading = false;
        setTimeout(() => {
          this.regUsername = this.regEmail = this.regFirstName = '';
          this.regLastName = this.regPassword = this.regPassword2 = '';
          this.closeAll();
          this.router.navigate(['/perfil']);
        }, 1500);
      },
      error: (err) => {
        if (err.error && typeof err.error === 'object') {
          const errors = Object.values(err.error).flat();
          this.regError = Array.isArray(errors) ? String(errors[0]) : 'Error en el registro';
        } else {
          this.regError = 'Error en el registro';
        }
        this.regLoading = false;
      }
    });
  }

  logout() { this.auth.logout(); this.router.navigate(['/']); }

  @HostListener('document:keydown.escape') onEscape() { this.closeAll(); }
}
