import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original: number | null;
  imagen: string;
  cantidad: number;
  categoria: string;
  rating: number;
  badge: string;
  destacado: boolean;
  en_carrusel: boolean;
  en_oferta: boolean;
  fecha_creacion: string;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private API_URL = 'http://localhost:8000/api/productos/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  getDestacados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?destacado=true`);
  }

  getCarrusel(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?en_carrusel=true`);
  }

  getOfertas(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?en_oferta=true`);
  }

  getByCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?categoria=${categoria}`);
  }

  search(query: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}?search=${encodeURIComponent(query)}`);
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}${id}/`);
  }
}
