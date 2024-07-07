import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

import { TMDB_CATEGORIES } from './movie/tmdb-categories';

export const isCategoryGuard: CanMatchFn = (route, segments) => {
  const availableCategories = inject(TMDB_CATEGORIES);

  return availableCategories
    .map(category => category.id)
    .includes(segments[1].path);
};
