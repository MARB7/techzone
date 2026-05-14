import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CartService } from '../../cart.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  cartService = inject(CartService);
  private auth = inject(AuthService);

  items = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  savings = this.cartService.savings;
  total = this.cartService.total;
  processing = this.cartService.processing;
  checkoutError = this.cartService.checkoutError;
  checkoutSuccess = this.cartService.checkoutSuccess;

  onCheckout() {
    // Si no está logueado, abrir el modal de login
    if (!this.auth.isAuthenticated()) {
      this.auth.showLoginModal.set(true);
      return;
    }
    this.cartService.checkout();
  }
}
