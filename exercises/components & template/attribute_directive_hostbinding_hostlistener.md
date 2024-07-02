# Exercise: Attribute Directives - use host bindings & host listeners

In this exercise we want to make use of a very convenient feature, `host bindings` and `host listeners`.
You will learn how angular simplifies the way how developers can interact with DOM APIs (`EventListener` & property changes). 

## 0. Create named callbacks & fields

First, we want to create our callback functions that we can use for our host listeners and fields that we can bind to the host attributes.

Implement the following methods and fields:

* `reset()` -> sets rotation to rotate(0deg)
* `rotate(event: MouseEvent)` -> sets deg to value 
* `rotation: string` -> the rotation value to bind

Also remove everything that was in the `ngOnInit` hook, we don't need this code any longer.

<details>
  <summary>Prepare the TiltDirective</summary>

```ts
import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[tilt]',
  standalone: true,
})
export class TiltDirective {
  tiltDegree = input(5);

  rotation = 'rotate(0deg)';

  constructor(private element: ElementRef<HTMLElement>) {}

  rotate(event: MouseEvent) {
    const pos = this.determineDirection(event.pageX);
    this.rotation = `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `-${this.tiltDegree()}deg`})`;
  }

  reset() {
    this.rotation = `rotate(0deg)`;
  }

  /* ... */
}

```

</details>


## 1. use HostBindings and HostListeners

Set up the `listeners`s as well as the `bindings` needed for our directive to work:

* `mouseenter`
* `mouseleave`
* `style.transform`

You want to define those in the `host` property of the `@Directive` decorator.

<details>
  <summary>use HostBindings and HostListeners</summary>

```ts

@Directive({
  selector: '[tilt]',
  standalone: true,
  host: {
    '(mouseleave)': 'reset()',
    '(mouseenter)': 'rotate($event)',
    '[style.transform]': 'rotation',
  },
})
export class TiltDirective {}
```
</details>

Congratulations, you have successfully implemented an `Attribute Directive` the angular way!

Now serve the application and test your result :)

```bash
ng serve
```

## Full Solution

<details>
  <summary>TiltDirective</summary>

```ts

import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[tilt]',
  standalone: true,
  host: {
    '(mouseleave)': 'reset()',
    '(mouseenter)': 'rotate($event)',
    '[style.transform]': 'rotation',
  },
})
export class TiltDirective {
  tiltDegree = input(5);

  rotation = 'rotate(0deg)';

  constructor(private element: ElementRef<HTMLElement>) {}

  rotate(event: MouseEvent) {
    const pos = this.determineDirection(event.pageX);
    this.rotation = `rotate(${pos === 0 ? `${this.tiltDegree()}deg` : `-${this.tiltDegree()}deg`})`;
  }

  reset() {
    this.rotation = `rotate(0deg)`;
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


```

</details>
