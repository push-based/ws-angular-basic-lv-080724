import { Routes } from '@angular/router';

import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: 'list/popular',
    component: MovieListPageComponent,
  },
  {
    path: '',
    redirectTo: 'list/popular',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
