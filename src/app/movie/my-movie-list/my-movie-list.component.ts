import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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

type TypedForm<T, K extends keyof T = keyof T> = FormGroup<{
  [key in K]: FormControl<T[key]>;
}>;

type FavoriteMovieForm = TypedForm<FavoriteMovie, 'title' | 'comment'>;

// FormGroup<{
//  title: FormControl<string>
//  comment: FormControl<string>
// }>

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
    <div class="favorites-list" [formGroup]="favoriteForm">
      <ng-container formArrayName="favorites">
        @for (favorite of favorites.controls; track favorite) {
          <div class="favorite-item" [formGroupName]="$index">
            <span class="favorite-item__title">{{
              favorite.controls.title.value
            }}</span>
            <div class="input-group">
              <label for="comment">Comment</label>
              <textarea
                [formControl]="favorite.controls.comment"
                (input)="onChange($index)"
                rows="5"
                name="comment"
                id="comment"></textarea>
            </div>
            <button class="btn btn__icon" (click)="removeFavorite($index)">
              <fast-svg name="delete" />
            </button>
          </div>
        }
      </ng-container>
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

  favorites: FormArray<FavoriteMovieForm> = new FormArray(
    this.movieService.getFavorites().map(favorite => {
      return this.createFavoriteGroup(favorite);
    })
  );

  favoriteForm = new FormGroup({
    favorites: this.favorites,
  });

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
      this.favorites.push(
        this.createFavoriteGroup({
          id: this.title.value,
          title: this.title.value,
          comment: this.comment.value,
        })
      );

      return true;
    }

    return false;
  }

  onChange(i: number) {
    const group = this.favorites.at(i);
    if (group.valid) {
      const favorite = group.getRawValue();
      this.movieService.updateFavorite({
        ...favorite,
        id: favorite.title,
      });
    }
  }

  removeFavorite(index: number) {
    const favoriteToRemove = this.favorites.controls.at(index).getRawValue();
    this.movieService.removeFavorite({
      ...favoriteToRemove,
      id: favoriteToRemove.title,
    });
    this.favorites.removeAt(index);
  }

  createFavoriteGroup(favorite: FavoriteMovie): FavoriteMovieForm {
    return new FormGroup({
      title: new FormControl<string>(favorite.title),
      comment: new FormControl<string>(favorite.comment, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }
}
