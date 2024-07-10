import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { MovieService } from '../movie/movie.service';
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
    FormsModule,
  ],
})
export class AppShellComponent {
  sideDrawerOpen = false;

  private _searchValue = '';
  get searchValue() {
    return this._searchValue;
  }
  set searchValue(term: string) {
    this._searchValue = term;
    this.search(term);
  }

  private router = inject(Router);
  private movieService = inject(MovieService);

  genres = signal<TMDBMovieGenreModel[]>([]);

  constructor() {
    // super hacky, but works ;)
    setTimeout(() => {
      this._searchValue =
        this.router.routerState.snapshot.root.children[0].params.term;
    });
    this.movieService.getGenres().subscribe(result => {
      this.genres.set(result.genres);
    });
  }

  search(term: string) {
    this.router.navigate(['/search', term]);
  }
}
