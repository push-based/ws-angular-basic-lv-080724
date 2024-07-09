import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movieImage',
  standalone: true,
})
export class MovieImagePipe implements PipeTransform {
  transform(image: string, width = 342): unknown {
    if (!image) {
      return 'assets/images/no_poster_available.jpg';
    }
    return `https://image.tmdb.org/t/p/w${width}${image}`;
  }
}
