import { ApplicationConfig } from '@angular/core';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      defaultSize: '12',
    }),
  ],
};
