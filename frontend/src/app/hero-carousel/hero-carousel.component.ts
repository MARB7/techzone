import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService, Producto } from '../producto.service';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.css'
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides: Producto[] = [];
  loading = true;
  currentIndex = signal(0);
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  isAutoPlaying = true;

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.productoService.getCarrusel().subscribe({
      next: (data) => {
        // Tomar los primeros 5 productos para el carrusel
        this.slides = data.slice(0, 5);
        this.loading = false;
        if (this.slides.length > 0) {
          this.startAutoPlay();
        }
      },
      error: () => this.loading = false
    });
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.isAutoPlaying && this.slides.length > 0) this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  next() {
    this.currentIndex.set((this.currentIndex() + 1) % this.slides.length);
  }

  prev() {
    this.currentIndex.set((this.currentIndex() - 1 + this.slides.length) % this.slides.length);
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }

  onMouseEnter() { this.isAutoPlaying = false; }
  onMouseLeave() { this.isAutoPlaying = true; }
}
