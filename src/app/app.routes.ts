import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/search/pages/search-page/search-page.component')
        .then(component => component.SearchPageComponent),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/pages/wishlist-page/wishlist-page.component')
        .then(component => component.WishlistPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];