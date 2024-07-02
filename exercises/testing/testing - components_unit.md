# Testing - Unit Tests For Components

In this exercise we will get to know how we can unit test the behavior of angular `Component`s.
By following the arrange => act => assert pattern, we will cover how to implement a basic set of unit tests for a `Component`.

## Goal

In the end of this exercise you will know how to implement basic unit tests for `Component`s in angular with the
`arrange` => `act` => `assert` pattern. We learn how to spy on method executions and how interact with the `DOM` in
unit tests.

## Unit Tests for MovieListComponent 

We will start by implementing a set of unit tests for the `MovieListComponent`.

Head to the `movie-list.component.spec.ts` file and execute it.
Run it either with your IDE, or execute the following script:

```bash
npm run test -- --testNamePattern=^MovieListComponent  --runTestsByPath ./src/app/movie/movie-list/movie-list.component.spec.ts
```

On top of the test being already in place, we want to add two more unit tests to this spec file.

* it - `should render movie-cards`
* it - `should navigate on card click`

For now, all the tests will follow the same simple pattern:

* arrange the component instance
* execute `fixture.detectChanges()` method
* create expectedResult values
* test result with `expect(result).toBe(expectedResult)`

### Test Data

You will need some test data in order to set proper input values. See the following code block for inspiration

<details>
    <summary>Test Data</summary>

```ts
// movie-list.component.spec.ts
const movies: MovieModel[] = [
    {
        id: '414906',
        poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        title: 'The Batman',
        vote_average: 7.9,
    },
    {
        id: '606402',
        poster_path: '/7MDgiFOPUCeG74nQsMKJuzTJrtc.jpg',
        title: 'Yaksha: Ruthless Operations',
        vote_average: 6.2,
    },
    {
        id: '799876',
        poster_path: '/lZa5EB6PVJBT5mxhgZS5ftqdAm6.jpg',
        title: 'The Outfit',
        vote_average: 7.1,
    },
    {
        id: '568124',
        poster_path: '/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
        title: 'Encanto',
        vote_average: 7.7,
    },
    {
        id: '823625',
        poster_path: '/bv9dy8mnwftdY2j6gG39gCfSFpV.jpg',
        title: 'Blacklight',
        vote_average: 6.1,
    },
    {
        id: '696806',
        poster_path: '/wFjboE0aFZNbVOF05fzrka9Fqyx.jpg',
        title: 'The Adam Project',
        vote_average: 7,
    },
];
```

</details>

### Setup TestBed

In order to proceed and properly use the `MovieListComponent` we need to make sure all of its dependencies are in place.
For this, you want to add `RouterTestingModule` and `MovieModule` to the `imports` of your `TestBed#configureTestingModule` 
function. Since `MovieModule` already exports `MovieListComponent` we don't need to re-declare it here. You can safely remove it from the testbed

<details>
    <summary>Setup TestBed</summary>

```ts
// movie-list.component.spec.ts

beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [RouterTestingModule, MovieModule],
        declarations: [],
    }).compileComponents();
});

```

</details>

### should render movie-cards

Now we can start writing our unit tests.

We want to test if our `MovieListComponent` is actually rendering `MovieCardComponent`s based on its input. 

Pass the `movies: MovieModel[]` array to the `component` instance and execute the `detectChanges` method from the fixture.

After that, the DOM should be ready, so you can ready from it. Read all `movie-card` children and test if the amount
is the same as the provided array.

<details>
    <summary>Show Solution</summary>

```ts
// movie-list.component.spec.ts

it('should render movie-cards', () => {
    // arrange
    component.movies = movies;
    fixture.detectChanges();
    const movieChildren = Array.from(
        fixture.nativeElement.querySelectorAll('movie-card')
    );
    
    // act
    // no action required, the framework does it's work
    
    // assert
    expect(movieChildren.length).toEqual(movies.length);
});
```
</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --testNamePattern=^MovieListComponent  --runTestsByPath ./src/app/movie/movie-list/movie-list.component.spec.ts
```

### should navigate on card click

Now we want to make sure `MovieListComponent` is properly reacting to the `movie-card`s events.

The test implementation cover the following process:

* Install a `spy` (`jest.spyOn`) for the `navToDetail` method of your component.
* fetch any of the `movie-card` child elements
* perform a click event on it's `div.movie-card`
* determine if the spy has been called


<details>
    <summary>Show Solution</summary>

```ts
// movie-list.component.spec.ts

it('should navigate on card click', () => {
    // arrange
    component.movies = movies;
    const navigateSpy = jest.spyOn(component, 'navToDetail');
    fixture.detectChanges();
    const movieChild: HTMLElement = fixture.nativeElement.querySelector(
        'movie-card .movie-card'
    ) as HTMLElement;
    
    // act
    movieChild.click();
    
    // assert
    expect(navigateSpy).toHaveBeenCalledTimes(1);
});
```
</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --testNamePattern=^MovieListComponent  --runTestsByPath ./src/app/movie/movie-list/movie-list.component.spec.ts
```
