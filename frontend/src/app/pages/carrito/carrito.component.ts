import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  cartService = inject(CartService);

  items = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  savings = this.cartService.savings;
  total = this.cartService.total;
}
