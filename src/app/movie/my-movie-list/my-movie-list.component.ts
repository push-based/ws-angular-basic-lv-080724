import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-movie-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form
      #formEl
      (submit)="
        formEl.checkValidity() && save();
        formEl.checkValidity() && formEl.reset()
      ">
      <div class="input-group">
        <label for="title">Title</label>
        <input
          required
          #titleCtrl="ngModel"
          [class.error]="titleCtrl.invalid"
          id="title"
          name="title"
          type="text"
          [(ngModel)]="title" />
        @if (
          titleCtrl.invalid &&
          (titleCtrl.touched || titleCtrl.formDirective.submitted)
        ) {
          <span class="error"> Please enter valid data </span>
        }
      </div>
      <div class="input-group">
        <label for="comment">Comment</label>
        <textarea
          #commentCtrl="ngModel"
          required
          minlength="5"
          rows="5"
          name="comment"
          id="comment"
          [(ngModel)]="comment"></textarea>
        @if (
          commentCtrl.invalid &&
          (commentCtrl.touched || commentCtrl.formDirective.submitted)
        ) {
          <span class="error">
            {{
              commentCtrl.hasError('minlength')
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
  `,
})
export class MyMovieListComponent {
  private favorites: { title: string; comment: string }[] = [];

  title = '';
  comment = '';

  save() {
    this.favorites.push({
      title: this.title,
      comment: this.comment,
    });
    console.log(this.favorites, 'favorites');
    this.reset();
  }

  reset() {
    this.title = '';
    this.comment = '';
  }
}
