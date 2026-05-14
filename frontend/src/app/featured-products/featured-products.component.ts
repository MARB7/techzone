import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../producto.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent implements OnInit {
  products = signal<Producto[]>([]);
  loading = signal(true);
  addedId = signal<number | null>(null);

  constructor(private productoService: ProductoService, private cart: CartService) {}

  ngOnInit() {
    this.productoService.getDestacados().subscribe({
      next: (data) => {
        this.products.set(data.slice(0, 4));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Producto) {
    this.cart.addToCart(product);
    this.addedId.set(product.id);
    setTimeout(() => this.addedId.set(null), 1500);
  }

  getAvailableStock(p: Producto): number {
    const item = this.cart.cartItems().find(i => i.producto.id === p.id);
    const inCart = item ? item.qty : 0;
    return p.cantidad - inCart;
  }
}
