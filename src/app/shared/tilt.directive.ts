import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[tilt]',
  standalone: true,
  host: {
    '[style.transform]': 'rotation',
    '(mouseleave)': 'reset()',
    '(mouseenter)': 'rotate($event)',
  },
})
export class TiltDirective {
  tiltDegree = input(5);

  rotation = 'rotate(0deg)';

  rotate(event: MouseEvent) {
    const pos = this.determineDirection(event.pageX);
    this.rotation = `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `${-this.tiltDegree()}deg`})`;
  }

  reset() {
    this.rotation = 'rotate(0deg)';
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  /**
   *
   * returns 0 if entered from left, 1 if entered from right
   */
  determineDirection(pos: number): 0 | 1 {
    const width = this.elementRef.nativeElement.clientWidth;
    const middle =
      this.elementRef.nativeElement.getBoundingClientRect().left + width / 2;
    return pos > middle ? 1 : 0;
  }
}
