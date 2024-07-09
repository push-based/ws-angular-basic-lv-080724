import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[tilt]',
  standalone: true,
})
export class TiltDirective {
  tiltDegree = input(5);

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.elementRef.nativeElement.addEventListener('mouseleave', () => {
      this.elementRef.nativeElement.style.transform = `rotate(0deg)`;
    });

    this.elementRef.nativeElement.addEventListener('mouseenter', event => {
      const pos = this.determineDirection(event.pageX);
      this.elementRef.nativeElement.style.transform = `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `${-this.tiltDegree()}deg`})`;
    });
  }

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
