import { isDevMode } from '@angular/core';

// Determina la URL de la API del backend
// En producción (Azure) o localmente usamos la IP pública o dominio de Azure
export const API_BASE_URL = 'http://20.151.88.18:8000'; // <-- Aquí pones la IP pública o dominio de tu backend en Azure
