import { Component } from '@angular/core';

import { AppShellComponent } from './app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  template: `
    <app-shell>
      <!-- app code here ;) -->
    </app-shell>
  `,
})
export class AppComponent {}
