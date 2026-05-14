import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { ProductoService, Producto } from '../../producto.service';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  viewMode = signal<'grid' | 'list'>('grid');
  showFilters = signal(false);
  sortBy = signal('relevancia');
  loading = signal(true);

  allProducts: Producto[] = [];

  categories = [
    { name: 'Procesadores', value: 'procesadores' },
    { name: 'Tarjetas Gráficas', value: 'tarjetas_graficas' },
    { name: 'Memoria RAM', value: 'ram' },
    { name: 'Almacenamiento', value: 'almacenamiento' },
    { name: 'Monitores', value: 'monitores' },
    { name: 'Teclados', value: 'teclados' },
    { name: 'Mouse', value: 'mouse' },
    { name: 'Auriculares', value: 'auriculares' },
    { name: 'Ventiladores', value: 'ventiladores' },
    { name: 'Chasis', value: 'chasis' },
  ];

  brands = ['AMD', 'NVIDIA', 'Intel', 'Corsair', 'ASUS', 'Logitech', 'Samsung', 'NZXT', 'Razer', 'HyperX'];

  selectedCategories = signal<string[]>([]);
  selectedBrands = signal<string[]>([]);
  priceMin = '';
  priceMax = '';

  pages = [1];
  currentPage = signal(1);

  constructor(
    private productoService: ProductoService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filteredProducts = signal<Producto[]>([]);

  applyFilters() {
    let products = this.allProducts;

    const cats = this.selectedCategories();
    if (cats.length > 0) {
      products = products.filter(p => cats.includes(p.categoria));
    }

    const brands = this.selectedBrands();
    if (brands.length > 0) {
      products = products.filter(p => {
        const searchText = (p.nombre + ' ' + p.descripcion).toLowerCase();
        return brands.some(b => searchText.includes(b.toLowerCase()));
      });
    }

    if (this.priceMin) {
      products = products.filter(p => Number(p.precio) >= Number(this.priceMin));
    }
    if (this.priceMax) {
      products = products.filter(p => Number(p.precio) <= Number(this.priceMax));
    }

    const sort = this.sortBy();
    if (sort === 'precio-asc') {
      products = [...products].sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (sort === 'precio-desc') {
      products = [...products].sort((a, b) => Number(b.precio) - Number(a.precio));
    } else if (sort === 'rating') {
      products = [...products].sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    this.filteredProducts.set(products);
  }

  toggleCategory(value: string) {
    const cats = this.selectedCategories();
    if (cats.includes(value)) {
      this.selectedCategories.set(cats.filter(c => c !== value));
    } else {
      this.selectedCategories.set([...cats, value]);
    }
  }

  toggleBrand(brand: string) {
    const brands = this.selectedBrands();
    if (brands.includes(brand)) {
      this.selectedBrands.set(brands.filter(b => b !== brand));
    } else {
      this.selectedBrands.set([...brands, brand]);
    }
  }

  getAvailableStock(p: Producto): number {
    const item = this.cartService.cartItems().find(i => i.producto.id === p.id);
    const inCart = item ? item.qty : 0;
    return p.cantidad - inCart;
  }
}
