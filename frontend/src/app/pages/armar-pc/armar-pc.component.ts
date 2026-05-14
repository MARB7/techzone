import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { ProductoService, Producto } from '../../producto.service';
import { CartService } from '../../cart.service';

export interface PCCategory {
  id: string;
  name: string;
  icon: string;
  selectorSide: 'left' | 'right';
  selectorY: number;
  position: { x: number; y: number };
  dbCategory: string; // Categoría en la base de datos
  options: Producto[];
  loading: boolean;
}

@Component({
  selector: 'app-armar-pc',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './armar-pc.component.html',
  styleUrl: './armar-pc.component.css'
})
export class ArmarPcComponent implements OnInit {
  selectedComponents = signal<Record<string, Producto | null>>({});
  activeCategory = signal<PCCategory | null>(null);
  isDialogOpen = signal(false);

  categories: PCCategory[] = [
    {
      id: 'cooling', name: 'Refrigeración', icon: 'fan', selectorSide: 'left', selectorY: 0,
      position: { x: 30, y: 12 }, dbCategory: 'ventiladores', options: [], loading: false
    },
    {
      id: 'cpu', name: 'Procesador', icon: 'cpu', selectorSide: 'right', selectorY: 0,
      position: { x: 45, y: 28 }, dbCategory: 'procesadores', options: [], loading: false
    },
    {
      id: 'ram', name: 'Memoria RAM', icon: 'ram', selectorSide: 'right', selectorY: 1,
      position: { x: 65, y: 25 }, dbCategory: 'ram', options: [], loading: false
    },
    {
      id: 'motherboard', name: 'Placa Base', icon: 'circuit', selectorSide: 'left', selectorY: 1,
      position: { x: 50, y: 45 }, dbCategory: 'motherboards', options: [], loading: false
    },
    {
      id: 'gpu', name: 'Tarjeta Gráfica', icon: 'gpu', selectorSide: 'right', selectorY: 2,
      position: { x: 45, y: 60 }, dbCategory: 'tarjetas_graficas', options: [], loading: false
    },
    {
      id: 'storage', name: 'Almacenamiento', icon: 'hdd', selectorSide: 'right', selectorY: 3,
      position: { x: 80, y: 40 }, dbCategory: 'almacenamiento', options: [], loading: false
    },
    {
      id: 'psu', name: 'Fuente de Poder', icon: 'zap', selectorSide: 'left', selectorY: 2,
      position: { x: 25, y: 85 }, dbCategory: 'fuentes', options: [], loading: false
    },
    {
      id: 'case', name: 'Chasis', icon: 'box', selectorSide: 'left', selectorY: 3,
      position: { x: 75, y: 85 }, dbCategory: 'chasis', options: [], loading: false
    },
  ];

  constructor(
    private productoService: ProductoService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Cargar productos de todas las categorías
    for (const cat of this.categories) {
      cat.loading = true;
      this.productoService.getByCategoria(cat.dbCategory).subscribe({
        next: (productos) => {
          cat.options = productos.filter(p => p.cantidad > 0);
          cat.loading = false;
        },
        error: () => {
          cat.loading = false;
        }
      });
    }
  }

  get leftCategories() {
    return this.categories.filter(c => c.selectorSide === 'left').sort((a, b) => a.selectorY - b.selectorY);
  }

  get rightCategories() {
    return this.categories.filter(c => c.selectorSide === 'right').sort((a, b) => a.selectorY - b.selectorY);
  }

  get totalPrice(): number {
    return Object.values(this.selectedComponents()).reduce((sum, c) => sum + (c ? Number(c.precio) : 0), 0);
  }

  get selectedCount(): number {
    return Object.keys(this.selectedComponents()).length;
  }

  isSelected(categoryId: string): boolean {
    return !!this.selectedComponents()[categoryId];
  }

  getSelected(categoryId: string): Producto | null {
    return this.selectedComponents()[categoryId] || null;
  }

  openCategory(cat: PCCategory) {
    this.activeCategory.set(cat);
    this.isDialogOpen.set(true);
  }

  selectComponent(categoryId: string, product: Producto) {
    this.selectedComponents.update(prev => ({ ...prev, [categoryId]: product }));
    this.isDialogOpen.set(false);
  }

  removeComponent(event: Event, categoryId: string) {
    event.stopPropagation();
    this.selectedComponents.update(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  }

  isCurrentlySelected(categoryId: string, productId: number): boolean {
    return this.selectedComponents()[categoryId]?.id === productId;
  }

  closeDialog() {
    this.isDialogOpen.set(false);
  }

  addAllToCart() {
    const selected = Object.values(this.selectedComponents());
    for (const product of selected) {
      if (product) {
        this.cartService.addToCart(product);
      }
    }
  }
}
