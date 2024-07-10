import { Routes } from '@angular/router';

import { isCategoryGuard } from './is-category.guard';
import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';

export const routes: Routes = [
  {
    path: 'list/:category',
    component: MovieListPageComponent,
    canMatch: [isCategoryGuard],
  },
  {
    path: '',
    redirectTo: 'list/popular',
    pathMatch: 'full',
  },
  {
    path: 'search/:term',
    component: MovieListPageComponent,
  },
  {
    path: 'genre/:genreId',
    component: MovieListPageComponent,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found-page/not-found-page.component').then(
        m => m.NotFoundPageComponent
      ),
  },
];
