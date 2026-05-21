import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

// 1. Guard para usuarios normales (perfil, carrito, etc.)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay un token de sesión activo, lo dejamos pasar
  if (authService.token()) {
    return true;
  }

  // Si no está logueado, lo mandamos al inicio
  router.navigate(['/']);
  return false;
};

// 2. Guard para el panel de administración
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Valida que el usuario tenga sesión activa Y su rol sea 'admin'
  if (authService.token() && authService.isAdmin()) {
    return true;
  }

  // Si no es admin, lo redirige al inicio
  router.navigate(['/']);
  return false;
};
