import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppShellComponent } from './app-shell/app-shell.component';
import { DirtyCheckComponent } from './shared/dirty-check/dirty-check.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet, DirtyCheckComponent],
  template: `
    <app-shell>
      <div></div>
      <dirty-check />
      <router-outlet />
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
