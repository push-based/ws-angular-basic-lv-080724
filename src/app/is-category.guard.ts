import { CanMatchFn } from '@angular/router';

export const isCategoryGuard: CanMatchFn = (route, segments) => {
  const availableCategories = ['popular', 'top_rated', 'upcoming'];
  return availableCategories.includes(segments[1].path);
};
