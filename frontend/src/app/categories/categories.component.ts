import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Category {
  name: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: Category[] = [
    { name: 'Mouse',            href: '/productos', icon: 'mouse'      },
    { name: 'Teclados',         href: '/productos', icon: 'keyboard'   },
    { name: 'Monitores',        href: '/productos', icon: 'monitor'    },
    { name: 'Procesadores',     href: '/productos', icon: 'cpu'        },
    { name: 'Tarjetas Gráficas',href: '/productos', icon: 'gpu'        },
    { name: 'Chasis',           href: '/productos', icon: 'case'       },
    { name: 'Ventiladores',     href: '/productos', icon: 'fan'        },
    { name: 'Auriculares',      href: '/productos', icon: 'headphones' },
    { name: 'Gamepads',         href: '/productos', icon: 'gamepad'    },
    { name: 'Memoria RAM',      href: '/productos', icon: 'ram'        },
  ];
}
