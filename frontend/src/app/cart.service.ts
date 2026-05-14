import { Injectable, signal, computed } from '@angular/core';
import { Producto } from './producto.service';

export interface CartItem {
  producto: Producto;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>(this.loadFromStorage());

  readonly cartItems = computed(() => this.items());
  readonly totalItems = computed(() => this.items().reduce((sum, i) => sum + i.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, i) => sum + Number(i.producto.precio) * i.qty, 0));
  readonly savings = computed(() => this.items().reduce((sum, i) => {
    const original = i.producto.precio_original ? Number(i.producto.precio_original) : Number(i.producto.precio);
    return sum + (original - Number(i.producto.precio)) * i.qty;
  }, 0));
  readonly total = computed(() => this.subtotal() - this.savings());

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
