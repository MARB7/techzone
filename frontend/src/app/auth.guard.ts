import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay token, permitimos el acceso provisional mientras se cargan los datos del usuario.
  if (authService.token()) {
    return true;
  }

  // Si no hay token, redirigimos a la página de inicio.
  router.navigate(['/']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Para el acceso de administrador, requerimos que exista un token activo.
  // El AdminComponent se encargará de validar reactivamente que el rol sea 'admin'.
  if (authService.token()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
