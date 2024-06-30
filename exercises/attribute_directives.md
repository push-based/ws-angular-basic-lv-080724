# Exercise: Attribute Directives

In this exercise we want to build our first `Attribute Directive`.

# Advanced way

implement the attribute directive `TiltDirective`. The directive should `rotate` its host element (hint: `ElementRef`)
when _entering_ it with the mouse and reset the rotation when the mouse _leaves_ the host element.

In addition to a simple rotation, the directive should rotate the element according to the position
the cursor entered the element.
If the cursor enters from **left** => rotate to the **right** and vice versa.

Use `ElementRef#nativeElement#addEventListener` to listen to events and `nativeElement#style#transform` to change
the tilt degree of the dom element.

As a final step, make the tilt degrees configurable with an `@Input` binding.

<details>
  <summary>Helper for advanced way</summary>

```bash
ng g directive tilt
```

```ts

transform = 'rotate()';

this.elementRef.nativeElement.addEventListener('event', callbackFn);

/**
 *
 * returns 0 if entered from left, 1 if entered from right
 */
determineDirection(pos: number): 0 | 1 {
    const width = this.el.nativeElement.clientWidth;
    const middle = this.el.nativeElement.getBoundingClientRect().left + width / 2;
    return (pos > middle ? 1 : 0);
}

```
</details>


# Step by Step

## implement tilt directive

now we want to add some funk to our component by letting it animate when we enter it with the mouse.

generate the directive

<details>
  <summary>Show Help</summary>


```bash
ng generate directive tilt

OR

ng g d tilt
```

```ts

@Directive({
    selector: '[tilt]'
})
export class TiltDirective {
    
    constructor() {}
}
```

</details>


implement the `OnInit` Interface and the `ngOninit` Lifecycle hook and set up a private variable
for the `ElementRef` in the constructor.

> Tip: type it with `HTMLElement`, you will have an easier life

<details>
    <summary>show result</summary>

```ts

@Directive({
    selector: '[tilt]'
})
export class TiltDirective implements OnInit {
    
    constructor(private el: ElementRef<HTMLElement>) {}
    
    ngOnInit() {}
    
}
```

</details>

setup the eventListeners in `ngOnInit`

<details>
  <summary>EventListener Setup</summary>


```ts

ngOnInit() {
  nativeElement.addEventListener('mouseleave', () => {
    // we want to reset the styles here
  });
  
  nativeElement.addEventListener('mouseenter', (event) => {
    // 
  });
}

```
</details>


implement the reset and a simple animation

<details>
  <summary>EventListener callbacks</summary>

```ts

ngOnInit() {
  nativeElement.addEventListener('mouseleave', () => {
    nativeElement.style.transform = 'rotate(0deg)';
  });
  
  nativeElement.addEventListener('mouseenter', () => {
    nativeElement.style.transform = 'rotate(30deg)';
  });
}
```

</details>

## use directive to adjust behavior of movie-card

apply the `tilt` directive to the `movie-card.component.html` template.

It should be applied to the `div.movie-card`.

<details>
  <summary>Show Help</summary>

```html
<!--movie-card.component.html-->

<div class="movie-card" tilt>
    <!--  content-->
</div>
```

</details>

serve the application and test your result

```bash
ng serve
```

## implement the funk :-D

now we want to add a more complex animation and tilt the movie-card according to the mouseposition on enter.

Create a method `determineDirection(pos: number): 0 | 1` in the `TiltDirective` class, which returns `0` in case
the mouse entered from the left side and `1` if it entered from the right side.

Use this method in the `mouseenter` callback in order to determine if we should tilt `-30` or `30` degrees.

<details>
  <summary>Show Help</summary>

```ts
// tilt.directive.ts

// OnInit
nativeElement.addEventListener('mouseenter', () => {
  const pos = this.determineDirection(event.pageX);
  this.el.nativeElement.style.transform = `rotate(${pos === 0 ? '30deg' : '-30deg'})`;
});

  /**
   *
   * returns 0 if entered from left, 1 if entered from right
   */
  determineDirection(pos: number): 0 | 1 {
    const width = this.el.nativeElement.clientWidth;
    const middle = this.el.nativeElement.getBoundingClientRect().left + width / 2;
    return (pos > middle ? 1 : 0);
  }
```

</details>

configure different `tilt` values in `movie-card`:

`([tilt]="value")`

<details>
  <summary>configure tilt values</summary>

```html
<!--movie-card.component.html-->
<div class="movie-card" [tilt]="15">
    <!--  content-->
</div>

```

</details>

serve the application and test your result

```bash
ng serve
```

## Bonus: make tilt degrees configurable

We can also make the tilt degrees configurable by using an `@Input` binding in the `TiltDirective`. To
make the DX as convenient as possible we can use the same name for the `@Input` as the directives' `selector`.

<details>
  <summary>configurable tilt degree</summary>

```ts
// tilt.directive.ts

@Input() tilt = 30;

```

</details>

use the input value in the `mouseenter` callback.

<details>
  <summary>use input value</summary>


```ts
// tilt.directive.ts

// OnInit
nativeElement.addEventListener('mouseenter', () => {
  const pos = this.determineDirection(event.pageX);
  this.el.nativeElement.style.transform = `rotate(${pos === 0 ? `${this.tilt}deg` : `-${this.tilt}deg`})`;
});

```

</details>
