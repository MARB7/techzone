import { isDevMode } from '@angular/core';

// Dirección base del API del backend.
// - En modo desarrollo (dev) local: apunta a http://localhost:8000
// - En producción: apunta a la dirección de tu servidor backend en Azure.
// Puedes cambiar 'https://techzone-api.azurewebsites.net' por el subdominio de Azure real de tu API.
export const API_BASE_URL = isDevMode()
  ? 'http://localhost:8000'
  : 'https://techzone-api.azurewebsites.net'; // <-- Reemplaza con tu URL de Azure
