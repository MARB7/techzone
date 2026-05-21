import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from './producto.service';
import { API_BASE_URL } from './config';

export interface CartItem {
  producto: Producto;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private API_URL = `${API_BASE_URL}/api/productos/`;

  private items = signal<CartItem[]>(this.loadFromStorage());

  // Estado del checkout
  processing = signal(false);
  checkoutError = signal<string | null>(null);
  checkoutSuccess = signal(false);

  readonly cartItems = computed(() => this.items());
  readonly totalItems = computed(() => this.items().reduce((sum, i) => sum + i.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, i) => sum + Number(i.producto.precio) * i.qty, 0));
  readonly savings = computed(() => this.items().reduce((sum, i) => {
    const original = i.producto.precio_original ? Number(i.producto.precio_original) : Number(i.producto.precio);
    return sum + (original - Number(i.producto.precio)) * i.qty;
  }, 0));
  readonly total = computed(() => this.subtotal());

  addToCart(producto: Producto) {
    const current = this.items();
    const existing = current.find(i => i.producto.id === producto.id);
    if (existing) {
      if (existing.qty >= producto.cantidad) return; // Validación de stock
      this.items.set(current.map(i =>
        i.producto.id === producto.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      if (producto.cantidad < 1) return; // Validación de stock
      this.items.set([...current, { producto, qty: 1 }]);
    }
    this.saveToStorage();
  }

  removeFromCart(productoId: number) {
    this.items.set(this.items().filter(i => i.producto.id !== productoId));
    this.saveToStorage();
  }

  changeQty(productoId: number, delta: number) {
    const current = this.items();
    const item = current.find(i => i.producto.id === productoId);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty < 1) {
      this.removeFromCart(productoId);
      return;
    }
    if (newQty > item.producto.cantidad) return; // Validación de stock
    this.items.set(current.map(i =>
      i.producto.id === productoId ? { ...i, qty: newQty } : i
    ));
    this.saveToStorage();
  }

  clearCart() {
    this.items.set([]);
    this.saveToStorage();
  }

  /**
   * Proceder al pago: envía los items del carrito al backend
   * para descontar stock de cada producto.
   */
  checkout() {
    const cartItems = this.items();
    if (cartItems.length === 0) return;

    this.processing.set(true);
    this.checkoutError.set(null);
    this.checkoutSuccess.set(false);

    const payload = {
      items: cartItems.map(i => ({
        producto_id: i.producto.id,
        qty: i.qty
      }))
    };

    this.http.post<{ message: string; productos: any[] }>(
      `${this.API_URL}checkout/`,
      payload
    ).subscribe({
      next: () => {
        this.clearCart();
        this.processing.set(false);
        this.checkoutSuccess.set(true);
        // Auto-ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => this.checkoutSuccess.set(false), 5000);
      },
      error: (err) => {
        this.processing.set(false);
        this.checkoutError.set(
          err.error?.error || 'Error al procesar el pago. Intenta de nuevo.'
        );
        // Auto-ocultar error después de 5 segundos
        setTimeout(() => this.checkoutError.set(null), 5000);
      }
    });
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem('cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
