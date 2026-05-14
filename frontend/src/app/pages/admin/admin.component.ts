import { Component, OnInit, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService, User } from '../../auth.service';
import { AdminService } from '../../admin.service';
import { Producto } from '../../producto.service';
import { ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab = signal<'productos' | 'usuarios'>('productos');

  // Productos
  productos: Producto[] = [];
  loadingProductos = true;
  showProductForm = false;
  editingProduct: Producto | null = null;

  // Form fields
  pNombre = '';
  pDescripcion = '';
  pPrecio = '';
  pPrecioOriginal = '';
  pImagen = '';
  pCantidad = '';
  pCategoria = 'procesadores';
  pRating = '';
  pBadge = '';
  pDestacado = false;
  pEnOferta = false;
  file?: File;
  preview?: string;

  categorias = [
    { value: 'procesadores', label: 'Procesadores' },
    { value: 'tarjetas_graficas', label: 'Tarjetas Gráficas' },
    { value: 'ram', label: 'Memoria RAM' },
    { value: 'almacenamiento', label: 'Almacenamiento' },
    { value: 'monitores', label: 'Monitores' },
    { value: 'teclados', label: 'Teclados' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'auriculares', label: 'Auriculares' },
    { value: 'chasis', label: 'Chasis' },
    { value: 'ventiladores', label: 'Ventiladores' },
    { value: 'gamepads', label: 'Gamepads' },
    { value: 'fuentes', label: 'Fuentes de Poder' },
    { value: 'motherboards', label: 'Motherboards' },
  ];

  // Usuarios
  usuarios: User[] = [];
  loadingUsuarios = true;

  // Messages
  successMsg = '';
  errorMsg = '';

  private dataLoaded = false;

  constructor(
    private auth: AuthService,
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Esperar a que el usuario cargue antes de verificar admin
    effect(() => {
      const user = this.auth.user();
      if (user && !this.dataLoaded) {
        if (user.perfil?.rol !== 'admin') {
          this.router.navigate(['/']);
        } else {
          this.dataLoaded = true;
          this.loadProductos();
          this.loadUsuarios();
        }
      } else if (!this.auth.token() && !this.dataLoaded) {
        this.router.navigate(['/']);
      }
    });
  }

  loadProductos() {
    this.loadingProductos = true;
    this.adminService.getProductos().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data);
        this.productos = data;
        this.loadingProductos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loadingProductos = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUsuarios() {
    this.loadingUsuarios = true;
    this.adminService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loadingUsuarios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.errorMsg = 'Error al cargar usuarios. Verifica tu conexión o sesión.';
        this.loadingUsuarios = false;
        setTimeout(() => { this.errorMsg = ''; this.cdr.detectChanges(); }, 5000);
        this.cdr.detectChanges();
      }
    });
  }

  refreshData() {
    this.loadProductos();
    this.loadUsuarios();
    this.successMsg = 'Datos actualizados desde la base de datos.';
    setTimeout(() => this.successMsg = '', 3000);
  }

  // ─── Product CRUD ───
  openNewProduct() {
    this.editingProduct = null;
    this.clearForm();
    this.showProductForm = true;
  }

  editProduct(p: Producto) {
    this.editingProduct = p;
    this.pNombre = p.nombre;
    this.pDescripcion = p.descripcion;
    this.pPrecio = String(p.precio);
    this.pPrecioOriginal = p.precio_original ? String(p.precio_original) : '';
    this.pImagen = p.imagen;
    this.pCantidad = String(p.cantidad);
    this.pCategoria = p.categoria;
    this.pRating = String(p.rating);
    this.pBadge = p.badge || '';
    this.pDestacado = p.destacado;
    this.pEnOferta = p.en_oferta;
    this.showProductForm = true;
  }

  saveProduct() {
    this.clearMessages();
    const formData = new FormData();
    formData.append('nombre', this.pNombre);
    formData.append('descripcion', this.pDescripcion);
    formData.append('precio', this.pPrecio);
    if (this.pPrecioOriginal) formData.append('precio_original', this.pPrecioOriginal);
    formData.append('cantidad', String(this.pCantidad));
    formData.append('categoria', this.pCategoria);
    formData.append('rating', this.pRating || '0');
    if (this.pBadge) formData.append('badge', this.pBadge);
    formData.append('destacado', String(this.pDestacado));
    formData.append('en_oferta', String(this.pEnOferta));

    if (this.file) {
      formData.append('imagen', this.file);
    }

    if (this.editingProduct) {
      this.adminService.editarProducto(this.editingProduct.id, formData).subscribe({
        next: () => {
          this.successMsg = 'Producto actualizado';
          this.showProductForm = false;
          this.loadProductos();
        },
        error: (e) => this.errorMsg = e.error?.error || 'Error al actualizar'
      });
    } else {
      this.adminService.crearProducto(formData).subscribe({
        next: () => {
          this.successMsg = 'Producto creado';
          this.showProductForm = false;
          this.loadProductos();
        },
        error: (e) => this.errorMsg = JSON.stringify(e.error) || 'Error al crear'
      });
    }
  }

  deleteProduct(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.clearMessages();
    this.adminService.eliminarProducto(p.id).subscribe({
      next: () => {
        this.successMsg = 'Producto eliminado';
        this.loadProductos();
      },
      error: (e) => this.errorMsg = e.error?.error || 'Error al eliminar'
    });
  }

  toggleCarousel(p: Producto) {
    this.clearMessages();
    const formData = new FormData();
    formData.append('nombre', p.nombre);
    formData.append('descripcion', p.descripcion);
    formData.append('precio', String(p.precio));
    if (p.precio_original) formData.append('precio_original', String(p.precio_original));
    formData.append('cantidad', String(p.cantidad));
    formData.append('categoria', p.categoria);
    formData.append('rating', String(p.rating || '0'));
    if (p.badge) formData.append('badge', p.badge);
    
    // Invertir el estado de destacado
    formData.append('destacado', String(!p.destacado));
    formData.append('en_oferta', String(p.en_oferta));

    this.adminService.editarProducto(p.id, formData).subscribe({
      next: () => {
        this.successMsg = !p.destacado ? 'Producto mostrado en el carrusel' : 'Producto ocultado del carrusel';
        this.loadProductos();
      },
      error: (e) => this.errorMsg = e.error?.error || 'Error al actualizar'
    });
  }

  // ─── User Management ───
  deleteUser(u: User) {
    if (!confirm(`¿Eliminar usuario "${u.username}"?`)) return;
    this.clearMessages();
    this.adminService.eliminarUsuario(u.id).subscribe({
      next: () => {
        this.successMsg = 'Usuario eliminado';
        this.loadUsuarios();
      },
      error: (e) => this.errorMsg = e.error?.error || 'Error al eliminar'
    });
  }

  // ─── Helpers ───
  clearForm() {
    this.pNombre = '';
    this.pDescripcion = '';
    this.pPrecio = '';
    this.pPrecioOriginal = '';
    this.pImagen = '';
    this.pCantidad = '';
    this.pCategoria = 'procesadores';
    this.pRating = '';
    this.pBadge = '';
    this.pDestacado = false;
    this.pEnOferta = false;
    this.file = undefined;
    this.preview = undefined;
  }

  clearMessages() {
    this.successMsg = '';
    this.errorMsg = '';
  }

  cancelForm() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.clearForm();
  }

   onFileChange(ev: any) {
    const f = ev.target.files[0];
    if (f) this.file = f;
    this.preview = URL.createObjectURL(f);
  }

   @ViewChild('fileinput') fileinput!: ElementRef<HTMLInputElement>;
}

