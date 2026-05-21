import { isDevMode } from '@angular/core';

// Determina la URL de la API del backend
// - Si estás programando localmente: usa http://localhost:8000
// - Si estás en producción (Azure): usa la IP pública de tu servidor de Azure (ej. puerto 8000)
export const API_BASE_URL = isDevMode()
  ? 'http://localhost:8000'
  : 'http://20.151.88.18:8000'; // <-- Aquí pones la IP pública de tu backend en Azure
