import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

export interface PCComponent {
  id: string;
  name: string;
  price: number;
  image: string;
  specs: string;
  rating: number;
}

export interface PCCategory {
  id: string;
  name: string;
  icon: string;
  selectorSide: 'left' | 'right';
  selectorY: number;
  position: { x: number; y: number };
  options: PCComponent[];
}

@Component({
  selector: 'app-armar-pc',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './armar-pc.component.html',
  styleUrl: './armar-pc.component.css'
})
export class ArmarPcComponent {
  selectedComponents = signal<Record<string, PCComponent | null>>({});
  activeCategory = signal<PCCategory | null>(null);
  isDialogOpen = signal(false);

  categories: PCCategory[] = [
    {
      id: 'cooling', name: 'Refrigeración', icon: 'fan', selectorSide: 'left', selectorY: 0,
      position: { x: 30, y: 12 },
      options: [
        { id: 'cool1', name: 'NZXT Kraken X73 RGB', price: 249.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '360mm AIO, LCD Display', rating: 9.3 },
        { id: 'cool2', name: 'Corsair iCUE H150i Elite', price: 189.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '360mm AIO, RGB', rating: 9.1 },
        { id: 'cool3', name: 'Noctua NH-D15', price: 99.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: 'Aire, Dual Tower', rating: 9.5 },
        { id: 'cool4', name: 'Arctic Liquid Freezer II', price: 129.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '360mm AIO, VRM Fan', rating: 9.4 },
      ]
    },
    {
      id: 'cpu', name: 'Procesador', icon: 'cpu', selectorSide: 'right', selectorY: 0,
      position: { x: 45, y: 28 },
      options: [
        { id: 'cpu1', name: 'AMD Ryzen 9 7950X', price: 549.99, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&h=200&fit=crop', specs: '16 núcleos, 32 hilos, 5.7GHz', rating: 9.4 },
        { id: 'cpu2', name: 'Intel Core i9-14900K', price: 589.99, image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=200&h=200&fit=crop', specs: '24 núcleos, 32 hilos, 6.0GHz', rating: 9.2 },
        { id: 'cpu3', name: 'AMD Ryzen 7 7800X3D', price: 449.99, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&h=200&fit=crop', specs: '8 núcleos, 16 hilos, 5.0GHz', rating: 9.6 },
        { id: 'cpu4', name: 'Intel Core i7-14700K', price: 409.99, image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=200&h=200&fit=crop', specs: '20 núcleos, 28 hilos, 5.6GHz', rating: 9.0 },
      ]
    },
    {
      id: 'ram', name: 'Memoria RAM', icon: 'ram', selectorSide: 'right', selectorY: 1,
      position: { x: 65, y: 25 },
      options: [
        { id: 'ram1', name: 'Corsair Vengeance 64GB', price: 279.99, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&h=200&fit=crop', specs: 'DDR5 6000MHz, CL30', rating: 9.2 },
        { id: 'ram2', name: 'G.Skill Trident Z5 32GB', price: 159.99, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&h=200&fit=crop', specs: 'DDR5 6400MHz, CL32', rating: 9.4 },
        { id: 'ram3', name: 'Kingston Fury 32GB', price: 129.99, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&h=200&fit=crop', specs: 'DDR5 5600MHz, CL36', rating: 8.8 },
        { id: 'ram4', name: 'Corsair Dominator 64GB', price: 349.99, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&h=200&fit=crop', specs: 'DDR5 6600MHz, CL32', rating: 9.5 },
      ]
    },
    {
      id: 'motherboard', name: 'Placa Base', icon: 'circuit', selectorSide: 'left', selectorY: 1,
      position: { x: 50, y: 45 },
      options: [
        { id: 'mb1', name: 'ASUS ROG Crosshair X670E', price: 699.99, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop', specs: 'AM5, DDR5, PCIe 5.0', rating: 9.5 },
        { id: 'mb2', name: 'MSI MEG Z790 ACE', price: 599.99, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop', specs: 'LGA1700, DDR5, WiFi 7', rating: 9.3 },
        { id: 'mb3', name: 'Gigabyte X670E AORUS Master', price: 549.99, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop', specs: 'AM5, DDR5, 4x M.2', rating: 9.2 },
        { id: 'mb4', name: 'ASRock Z790 Taichi', price: 499.99, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop', specs: 'LGA1700, DDR5, Thunderbolt 4', rating: 9.0 },
      ]
    },
    {
      id: 'gpu', name: 'Tarjeta Gráfica', icon: 'gpu', selectorSide: 'right', selectorY: 2,
      position: { x: 45, y: 60 },
      options: [
        { id: 'gpu1', name: 'NVIDIA RTX 4090', price: 1599.99, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&h=200&fit=crop', specs: '24GB GDDR6X, Ray Tracing', rating: 9.8 },
        { id: 'gpu2', name: 'NVIDIA RTX 4080 Super', price: 999.99, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&h=200&fit=crop', specs: '16GB GDDR6X, DLSS 3.5', rating: 9.5 },
        { id: 'gpu3', name: 'AMD RX 7900 XTX', price: 949.99, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&h=200&fit=crop', specs: '24GB GDDR6, FSR 3.0', rating: 9.3 },
        { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti Super', price: 799.99, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&h=200&fit=crop', specs: '16GB GDDR6X, DLSS 3', rating: 9.1 },
      ]
    },
    {
      id: 'storage', name: 'Almacenamiento', icon: 'hdd', selectorSide: 'right', selectorY: 3,
      position: { x: 80, y: 40 },
      options: [
        { id: 'ssd1', name: 'Samsung 990 Pro 2TB', price: 189.99, image: 'https://images.unsplash.com/photo-1597138804456-e7dca7f59d54?w=200&h=200&fit=crop', specs: 'NVMe M.2, 7450MB/s', rating: 9.6 },
        { id: 'ssd2', name: 'WD Black SN850X 2TB', price: 179.99, image: 'https://images.unsplash.com/photo-1597138804456-e7dca7f59d54?w=200&h=200&fit=crop', specs: 'NVMe M.2, 7300MB/s', rating: 9.3 },
        { id: 'ssd3', name: 'Crucial T700 2TB', price: 249.99, image: 'https://images.unsplash.com/photo-1597138804456-e7dca7f59d54?w=200&h=200&fit=crop', specs: 'NVMe Gen5, 12400MB/s', rating: 9.7 },
        { id: 'ssd4', name: 'Seagate FireCuda 530 1TB', price: 109.99, image: 'https://images.unsplash.com/photo-1597138804456-e7dca7f59d54?w=200&h=200&fit=crop', specs: 'NVMe M.2, 7300MB/s', rating: 9.0 },
      ]
    },
    {
      id: 'psu', name: 'Fuente de Poder', icon: 'zap', selectorSide: 'left', selectorY: 2,
      position: { x: 25, y: 85 },
      options: [
        { id: 'psu1', name: 'Corsair RM1000x', price: 189.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '1000W, 80+ Gold, Modular', rating: 9.4 },
        { id: 'psu2', name: 'EVGA SuperNOVA 1000 G7', price: 179.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '1000W, 80+ Gold, Full Modular', rating: 9.2 },
        { id: 'psu3', name: 'Seasonic Prime TX-850', price: 229.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '850W, 80+ Titanium', rating: 9.6 },
        { id: 'psu4', name: 'be quiet! Dark Power 13', price: 259.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: '1000W, 80+ Titanium', rating: 9.5 },
      ]
    },
    {
      id: 'case', name: 'Chasis', icon: 'box', selectorSide: 'left', selectorY: 3,
      position: { x: 75, y: 85 },
      options: [
        { id: 'case1', name: 'Lian Li O11 Dynamic EVO', price: 169.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: 'Mid Tower, Dual Chamber', rating: 9.6 },
        { id: 'case2', name: 'NZXT H9 Elite', price: 199.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: 'Mid Tower, Dual Glass', rating: 9.3 },
        { id: 'case3', name: 'Corsair 5000D Airflow', price: 174.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: 'Mid Tower, High Airflow', rating: 9.2 },
        { id: 'case4', name: 'Fractal Design Torrent', price: 189.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop', specs: 'Full Tower, Open Front', rating: 9.4 },
      ]
    },
  ];

  get leftCategories() {
    return this.categories.filter(c => c.selectorSide === 'left').sort((a, b) => a.selectorY - b.selectorY);
  }

  get rightCategories() {
    return this.categories.filter(c => c.selectorSide === 'right').sort((a, b) => a.selectorY - b.selectorY);
  }

  get totalPrice(): number {
    return Object.values(this.selectedComponents()).reduce((sum, c) => sum + (c?.price || 0), 0);
  }

  get selectedCount(): number {
    return Object.keys(this.selectedComponents()).length;
  }

  isSelected(categoryId: string): boolean {
    return !!this.selectedComponents()[categoryId];
  }

  getSelected(categoryId: string): PCComponent | null {
    return this.selectedComponents()[categoryId] || null;
  }

  openCategory(cat: PCCategory) {
    this.activeCategory.set(cat);
    this.isDialogOpen.set(true);
  }

  selectComponent(categoryId: string, component: PCComponent) {
    this.selectedComponents.update(prev => ({ ...prev, [categoryId]: component }));
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

  isCurrentlySelected(categoryId: string, optionId: string): boolean {
    return this.selectedComponents()[categoryId]?.id === optionId;
  }

  closeDialog() {
    this.isDialogOpen.set(false);
  }
}
