import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './producto.service';
import { User } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private PRODUCTOS_URL = 'http://localhost:8000/api/productos/';
  private USUARIOS_URL = 'http://localhost:8000/api/usuarios/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  // ─── Productos ───
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.PRODUCTOS_URL);
  }

  crearProducto(data: any): Observable<Producto> {
    let headers = this.getHeaders();
    if (!(data instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.http.post<Producto>(`${this.PRODUCTOS_URL}admin/crear/`, data, {
      headers: headers
    });
  }

  editarProducto(id: number, data: any): Observable<Producto> {
    let headers = this.getHeaders();
    if (!(data instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.http.put<Producto>(`${this.PRODUCTOS_URL}admin/${id}/`, data, {
      headers: headers
    });
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.PRODUCTOS_URL}admin/${id}/`, {
      headers: this.getHeaders()
    });
  }

  // ─── Usuarios ───
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.USUARIOS_URL}admin/`, {
      headers: this.getHeaders()
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.USUARIOS_URL}admin/${id}/`, {
      headers: this.getHeaders()
    });
  }
}
