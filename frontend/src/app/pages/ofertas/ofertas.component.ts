import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { ProductoService, Producto } from '../../producto.service';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent implements OnInit {
  timeLeft = { hours: 11, minutes: 47, seconds: 23 };
  products = signal<Producto[]>([]);
  loading = signal(true);

  constructor(
    private productoService: ProductoService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.productoService.getOfertas().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getDiscount(product: Producto): number {
    if (product.precio_original && Number(product.precio_original) > Number(product.precio)) {
      return Math.round((1 - Number(product.precio) / Number(product.precio_original)) * 100);
    }
    return 0;
  }

  getAvailableStock(p: Producto): number {
    const item = this.cartService.cartItems().find(i => i.producto.id === p.id);
    const inCart = item ? item.qty : 0;
    return p.cantidad - inCart;
  }
}
