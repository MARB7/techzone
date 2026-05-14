import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeroCarouselComponent } from '../../hero-carousel/hero-carousel.component';
import { CategoriesComponent } from '../../categories/categories.component';
import { PromoBannersComponent } from '../../promo-banners/promo-banners.component';
import { FeaturedProductsComponent } from '../../featured-products/featured-products.component';
import { ForYouComponent } from '../../for-you/for-you.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    HeroCarouselComponent,
    CategoriesComponent,
    PromoBannersComponent,
    FeaturedProductsComponent,
    ForYouComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
