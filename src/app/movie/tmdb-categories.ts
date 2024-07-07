import { InjectionToken } from '@angular/core';

import { TMBDCategory } from '../shared/model/movie-category.model';

export const TMDB_CATEGORIES = new InjectionToken<TMBDCategory[]>(
  'tmdb-categories'
);

export const provideTMDBCategories = () => [
  {
    provide: TMDB_CATEGORIES,
    useValue: [
      {
        id: 'popular',
        label: 'Popular',
      },
      {
        id: 'top_rated',
        label: 'Top Rated',
      },
      {
        id: 'upcoming',
        label: 'Upcoming',
      },
    ],
  },
];
