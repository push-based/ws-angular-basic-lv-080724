# Testing - Integration Tests For Directives

In this exercise we will get to know how to implement basic integration tests for angular `Directives`s.
As a `Directive` only makes sense to be used in a components' context, this is the perfect candidate to have an integration test.

## Goal

In the end of this exercise you will know how to implement basic integration tests for `Directives`s in angular with the
`arrange` => `act` => `assert` pattern. We learn how to set up a `TestComponent` to serve as integration target.


## Integration Test

Up until this point, we only tested completely isolated behavior of single components. Let's get to the next step
and implement our first integration test.

### Setup TestComponent

Since we want to integrate the `MovieListComponent` we need a new component serving the purpose.
Stay in the `movie-list.component.spec.ts` file and add a new `@Component` definition for `MovieListTestComponent`.
The template should only define the `movie-list` component.

To make our life easier, add a `@ViewChild` selector for the `movie-list` component.

<details>
    <summary>TiltTestComponent</summary>

```ts
// tilt.directive.spec.ts

@Component({
  selector: 'tilt-test',
  template: `<div [tilt]="30"></div>`,
})
class TiltTestComponent {
  @ViewChild(TiltDirective)
  tiltDirective: TiltDirective;
}

```

</details>

### Setup TestBed

In order to properly use the `TiltTestComponent` and integrate the `TiltDirective` we need to make sure the
`TestBed` is configured properly.

Introduce a `beforeEach()` block to configure our `TestBed`.

You also want to introduce helper variables to have simple access to all needed APIs during our test cases.

```ts
let fixture: ComponentFixture<TiltTestComponent>;
let nativeElement: HTMLElement;
let component: TiltTestComponent;
```

Adjust the `TestBed` according to our needs.  
For this, add `TiltTestComponent` to the `declarations` array and import the `TiltDirective`.

<details>
    <summary>Setup TestBed</summary>

```ts
// tilt.directive.spec.ts

describe('TiltDirective', () => {
  let fixture: ComponentFixture<TiltTestComponent>;
  let nativeElement: HTMLElement;
  let component: TiltTestComponent;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TiltTestComponent],
      imports: [TiltDirective],
    });
    fixture = TestBed.createComponent(TiltTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.nativeElement;
  });
  
  
});

```

</details>

Great, it's time to implement the actual test cases.

### Implement integration Tests

Now everything is in place! Let's implement two test cases in an integration scenario.
The two tests we want to implement:

* it `should be accessible as ViewChild`
* it `should rotate`
* it `should rotate back`
* it `should change rotation degree`

#### it `should be accessible as ViewChild`

This test should just check if the `TiltDirective` is accessible (`toBeTruthy()`) as the `tiltDirective` property
in the `TiltTestComponent`.

<details>
    <summary>Show solution</summary>

```ts
// tilt.directive.spec.ts

it('should be accessible as ViewChild', () => {
    // assert
    expect(component.tiltDirective).toBeTruthy();
});
```

</details>

Execute the test suite and watch your test fail or pass :)

#### it `should rotate`

Now let's test the actual behavior of our directive applied to the test component. This test should check
if the `HTMLElement` the `TiltDirective` is applied to, is actually changing its styles accordingly after
a `mouseenter` event.

For this, you need to read the `div = nativeElement.querySelector('div');`. Afterwards you can create
a new `MouseEvent('mouseenter')` which you can use to dispatch the event on the `div`, e.g. `div.dispatch(event)`.

In the end you should `expect(div.style.transform).toBe('the-desired-style')`.

<details>
    <summary>Show solution</summary>

```ts
// tilt.directive.spec.ts

it('should rotate', () => {
  // arrange
  const div = nativeElement.querySelector('div');
  const mouseEnter = new MouseEvent('mouseenter');
  const expectedTransform = 'rotate(30deg)';
  
  // act
  div.dispatchEvent(mouseEnter);
  fixture.detectChanges();
  
  // assert
  expect(div.style.transform).toBe(expectedTransform);
});
```

</details>

Execute the test suite and watch your test fail or pass :)

#### it `should rotate back`

As another test scenario we also want to know if the styles get reverted after a `mouseleave` event.

This test should check if the `HTMLElement` the `TiltDirective` is applied to, is actually changing its styles back accordingly after
a `mouseleave` event.

The setup is quite similar to the one from `it should rotate`, but you need to have another `MouseEvent('mouseleave')` that is firing
after a `mouseenter` event and dispatch both of them.


In the end you should `expect(div.style.transform).toBe('rotate(0deg)')`.


<details>
    <summary>Show solution</summary>

```ts
// tilt.directive.spec.ts

it('should rotate back', () => {
  // arrange
  const div = nativeElement.querySelector('div');
  const mouseEnter = new MouseEvent('mouseenter');
  const mouseLeave = new MouseEvent('mouseleave');
  const expectedTransform = 'rotate(0deg)';
  
  // act
  div.dispatchEvent(mouseEnter);
  fixture.detectChanges();
  div.dispatchEvent(mouseLeave);
  fixture.detectChanges();
  
  // assert
  expect(div.style.transform).toBe(expectedTransform);
});
```

</details>

Execute the test suite and watch your test fail or pass :)

### Bonus: it `should change rotation degree`

Please write a test case that tests if the `TiltDirective` is reacting to different kind of input values.

> hint: you can (or should) adjust the `TiltTestComponent`, it should have a field and value binding for the tilt directives input value

In the end you should `expect(div.style.transform).toBe('rotate(customdeg)')`.

**No solution provided**

Execute the test suite and watch your test fail or pass :)
