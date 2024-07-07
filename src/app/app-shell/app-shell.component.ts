import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { MovieService } from '../movie/movie.service';
import { TMDB_CATEGORIES } from '../movie/tmdb-categories';
import { TMDBMovieGenreModel } from '../shared/model/movie-genre.model';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    SideDrawerComponent,
    FastSvgComponent,
    HamburgerButtonComponent,
    SearchBarComponent,
    DarkModeToggleComponent,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppShellComponent {
  private movieService = inject(MovieService);

  sideDrawerOpen = false;

  router = inject(Router);

  genres = signal<TMDBMovieGenreModel[]>([]);

  categories = inject(TMDB_CATEGORIES);

  constructor() {
    this.movieService
      .getGenres()
      .subscribe(({ genres }) => this.genres.set(genres));
  }

  search(query: string) {
    this.router.navigate(['/search', query]);
  }
}
