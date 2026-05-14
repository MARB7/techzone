import { Component } from '@angular/core';

@Component({
  selector: 'app-promo-banners',
  standalone: true,
  templateUrl: './promo-banners.component.html',
  styleUrl: './promo-banners.component.css'
})
export class PromoBannersComponent {
  features = [
    { icon: 'truck',        title: 'Envío Gratis',       description: 'En compras mayores a $500'    },
    { icon: 'shield',       title: 'Garantía Extendida', description: 'Hasta 3 años de garantía'     },
    { icon: 'headphones',   title: 'Soporte 24/7',       description: 'Atención al cliente siempre'  },
    { icon: 'credit-card',  title: 'Pago Seguro',        description: 'Múltiples métodos de pago'    },
  ];
}
