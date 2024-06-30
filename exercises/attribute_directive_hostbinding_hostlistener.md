# Exercise: Attribute Directives - use HostBinding & HostListener

In this exercise we want to make use of another set of angular `Decorators` and improve our existing
`TiltDirective`.
You will learn how angular simplifies the way how developers can interact with DOM APIs (`EventListener` & property changes). 

## use HostBindings and HostListeners

Our `TiltDirective` is already able to manipulate the `DOM` as we want. Now it's time to refactor it the angular way, yaay!

Set up the `@HostListener`s as well as the `@HostBinding` needed for our directive to work:

* `mouseenter`
* `mouseleave`
* `style.transform`

<details>
  <summary>Show Help</summary>

```ts

@HostListener('mouseenter', ['$event'])
onMouseenter(event: MouseEvent) {
   // mouseenter callback logic
   // determineDirection
   // this.rotation = value;
}

@HostListener('mouseleave')
onMouseleave() {
  // mouseenter callback logic
  // determineDirection
  // this.rotation = '0deg'
}

@HostBinding('style.transform')
rotation = '0deg';
```
</details>

Move the respective functionality from the manual bindings made to the `ElementRef.nativeElement`.
When you've finished the implementation, you can probably remove the `ngOnInit` method as well as 
the injected `ElementRef`.

Congratulations, you have successfully implemented an `Attribute Directive` the angular way!

Now serve the application and test your result :)

```bash
ng serve
```
