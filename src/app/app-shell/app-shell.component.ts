import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

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
  ],
})
export class AppShellComponent {
  sideDrawerOpen = false;
}
