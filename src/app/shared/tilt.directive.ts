import { Directive, ElementRef, input, signal } from '@angular/core';

@Directive({
  selector: '[tilt]',
  standalone: true,
  host: {
    '(mouseleave)': 'reset()',
    '(mouseenter)': 'rotate($event)',
    '[style.transform]': 'rotation()',
  },
})
export class TiltDirective {
  tiltDegree = input(5);

  rotation = signal('rotate(0deg)');

  constructor(private element: ElementRef<HTMLElement>) {}

  rotate(event: MouseEvent) {
    const pos = this.determineDirection(event.pageX);
    this.rotation.set(
      `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `-${this.tiltDegree()}deg`})`
    );
  }

  reset() {
    this.rotation.set(`rotate(0deg)`);
  }

  /**
   *
   * returns 0 if entered from left, 1 if entered from right
   */
  determineDirection(pos: number): 0 | 1 {
    const width = this.element.nativeElement.clientWidth;
    const middle =
      this.element.nativeElement.getBoundingClientRect().left + width / 2;
    return pos > middle ? 1 : 0;
  }
}
