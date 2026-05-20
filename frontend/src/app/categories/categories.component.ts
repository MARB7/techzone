import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Category {
  name: string;
  href: string;
  icon: string;
  value: string;
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
    { name: 'Mouse',            href: '/productos', icon: 'mouse',      value: 'mouse'             },
    { name: 'Teclados',         href: '/productos', icon: 'keyboard',   value: 'teclados'          },
    { name: 'Monitores',        href: '/productos', icon: 'monitor',    value: 'monitores'         },
    { name: 'Procesadores',     href: '/productos', icon: 'cpu',        value: 'procesadores'      },
    { name: 'Tarjetas Gráficas',href: '/productos', icon: 'gpu',        value: 'tarjetas_graficas' },
    { name: 'Chasis',           href: '/productos', icon: 'case',       value: 'chasis'            },
    { name: 'Ventiladores',     href: '/productos', icon: 'fan',        value: 'ventiladores'      },
    { name: 'Auriculares',      href: '/productos', icon: 'headphones', value: 'auriculares'       },
    { name: 'Gamepads',         href: '/productos', icon: 'gamepad',    value: 'gamepads'          },
    { name: 'Memoria RAM',      href: '/productos', icon: 'ram',        value: 'ram'               },
  ];
}
