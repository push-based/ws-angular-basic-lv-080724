import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { FavoriteMovie } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';

const uniqueValidator = (): ValidatorFn => {
  // we are in injectionContext here <-
  const movieService = inject(MovieService);

  return (control: AbstractControl) => {
    const title = control.value;
    const favorites = movieService.getFavorites();
    const isInValid = favorites.some(favorite => favorite.title === title);
    if (!isInValid) {
      return null;
    }
    return {
      unique: 'this title already exists',
    };
  };
};

@Component({
  selector: 'my-movie-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FastSvgComponent],
  template: `
    <form
      [formGroup]="form"
      #formEl="ngForm"
      (ngSubmit)="save() && formEl.resetForm()">
      <div class="input-group">
        <label for="title">Title</label>
        <input
          [formControl]="title"
          [class.error]="title.invalid"
          id="title"
          name="title"
          type="text" />
        @if (title.invalid && (title.touched || formEl.submitted)) {
          @if (title.hasError('unique')) {
            <span class="error"> {{ title.errors['unique'] }} </span>
          } @else {
            <span class="error"> This is required </span>
          }
        }
      </div>
      <div class="input-group">
        <label for="comment">Comment</label>
        <textarea
          [formControl]="comment"
          rows="5"
          name="comment"
          id="comment"></textarea>
        @if (comment.invalid && (comment.touched || formEl.submitted)) {
          <span class="error">
            {{
              comment.hasError('minlength')
                ? 'Enter at least 5 characters'
                : 'Please enter at least something'
            }}
          </span>
        }
      </div>
      <div class="button-group">
        <button class="btn" type="reset">Reset</button>
        <button class="btn primary-button" type="submit">Save</button>
      </div>
    </form>

    <h2>Favorite Movies</h2>
    <div class="favorites-list">
      @for (favorite of favorites; track favorite.id) {
        <div class="favorite-item">
          <span class="favorite-item__title">{{ favorite.title }}</span>
          <span class="favorite-item__comment">{{ favorite.comment }}</span>
          <button class="btn btn__icon" (click)="removeFavorite(favorite)">
            <fast-svg name="delete" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      padding: 0 1rem;
      display: block;
    }

    form {
      width: 500px;
    }

    .input-group {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      flex-direction: column;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      button:first-child {
        margin-right: 0.5rem;
      }
    }

    .error {
      color: darkred;
      font-size: var(--text-sm);
    }

    textarea,
    input {
      &.ng-invalid {
        &.ng-touched,
        .ng-submitted & {
          border-color: darkred;
          background-color: rgba(139, 0, 0, 0.33);
        }
      }
      border: 1px solid black;
      padding: 4px;
      border-radius: 6px;
      outline: none;
      transition:
        border-color 100ms,
        background-color 100ms;
      &:focus {
        border-color: var(--palette-primary-main);
      }
    }
    .favorite-item {
      padding: 1rem 0.5rem;
      display: flex;
      font-size: var(--text-lg);
      align-items: center;

      textarea.ng-invalid {
        border-color: darkred;
        background-color: rgba(139, 0, 0, 0.33);
      }

      .btn {
        overflow: hidden;
      }

      &__title {
        width: 125px;
      }
    }
  `,
})
export class MyMovieListComponent {
  movieService = inject(MovieService);

  favorites: FavoriteMovie[] = this.movieService.getFavorites();

  title = new FormControl('', {
    validators: [Validators.required, uniqueValidator()],
    nonNullable: true,
  });
  comment = new FormControl('', {
    validators: [Validators.required, Validators.minLength(5)],
    nonNullable: true,
  });

  form = new FormGroup({
    title: this.title,
    comment: this.comment,
  });

  save(): boolean {
    if (this.form.valid) {
      this.movieService.addFavorite({
        id: this.title.value,
        title: this.title.value,
        comment: this.comment.value,
      });
      this.favorites = this.movieService.getFavorites();

      return true;
    }

    return false;
  }

  removeFavorite(favorite: FavoriteMovie) {
    this.movieService.removeFavorite(favorite);
    this.favorites = this.movieService.getFavorites();
  }
}
