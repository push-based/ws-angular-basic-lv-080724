import { Component, DoCheck, OnInit } from '@angular/core';

@Component({
  selector: 'dirty-check',
  standalone: true,
  template: ` <code class="dirty-checks">({{ checked() }})</code> `,
  styles: [
    `
      :host {
        display: inline-block;
        border-radius: 100%;
        border: 2px solid var(--palette-secondary-main);
        padding: 1rem;
        font-size: var(--text-lg);
      }
    `,
  ],
})
export class DirtyCheckComponent implements DoCheck, OnInit {
  _checked = 0;
  checked = () => {
    return this._checked++;
  };

  // checked = signal(0);

  ngOnInit() {
    // forgot that one here
  }

  ngDoCheck() {
    // forgot to remove that here
  }
}
