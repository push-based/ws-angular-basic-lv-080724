import { Routes } from '@angular/router';

import { isCategoryGuard } from './is-category.guard';
import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list/popular',
  },
  {
    path: 'list/:category',
    component: MovieListPageComponent,
    canMatch: [isCategoryGuard],
  },
  {
    path: 'genre/:genreId',
    component: MovieListPageComponent,
  },
  {
    path: 'search/:query',
    component: MovieListPageComponent,
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./movie/movie-detail-page/movie-detail-page.component').then(
        m => m.MovieDetailPageComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found-page/not-found-page.component').then(
        m => m.NotFoundPageComponent
      ),
  },
];
