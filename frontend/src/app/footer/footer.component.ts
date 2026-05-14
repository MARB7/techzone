import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  year = new Date().getFullYear();

  quickLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Ofertas', href: '/ofertas' },
    { name: 'Armar PC', href: '/armar-pc' },
  ];

  categories = ['Procesadores', 'Tarjetas Gráficas', 'Memorias RAM', 'Almacenamiento', 'Periféricos'];
}
