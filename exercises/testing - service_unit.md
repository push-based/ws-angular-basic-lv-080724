# Testing - Unit Tests For Services

In this exercise we will get to know the basics of unit testing `Service`s in angular.

## Goal

The goal of this exercise is to understand how to implement unit tests for `Service`s including the usage of `Http` resources.
For this we will learn how to make use of angulars `HttpClientTestingModule` in order to intercept http calls and interact with them in the test environment.

## Unit Tests for `MovieService` 

We will start by implementing a set of unit tests for the `MovieService`.

Head to the `movie.service.spec.ts` file and execute it.
Run it either with your IDE, or execute the following script:

```bash
npm run test -- --runTestsByPath ./src/app/movie/movie.service.spec.ts
```

When executing the test suite in its current state, you should see the following output appearing in your terminal

```bash
  ● MovieService › should be created

    NullInjectorError: R3InjectorError(DynamicTestModule)[MovieService -> HttpClient -> HttpClient]: 
      NullInjectorError: No provider for HttpClient!
```

On top of fixing the test being already in place, we want to add two more test scenarios to this spec file.

* it - `should return movies by category`
* it - `should throw an error`

Let's start with fixing the first test by setting up the TestBed to manage the missing dependencies. 

### Setup TestBed

In order to test the `MovieService` we need to fulfill its dependency requirements.
Since it relies on the `HttpClient` we need to provide it.
Angular has an already built in `HttpClientTestingModule` for us to have a suitable API for testing purposes with the
`HttpClient`.

* import `HttpClientTestingModule & HttpTestingController` from `@angular/common/http/testing`
* create a local variable `httpTestingController: HttpTestingColler`
* add `HttpClientTestingModule` to the imports of your `TestBed`
* `inject` the `HttpTestingController` and assign it to your local variable


<details>
    <summary>TestBed</summary>

```ts
// movie-list.component.spec.ts

let httpTestingController: HttpTestingController;

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MovieService);
    // Inject the test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
});

```
</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --runTestsByPath ./src/app/movie/movie.service.spec.ts
```

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

### should return movies by category

In this test scenario we want to make sure that the method `getMoviesByCategory` is interacting properly with
the `TMDB` api and returning the data coming from the HttpRequest.

For this to work we need to do the following steps:

* create test case `it('should return movies by category', /* ... */)`
* set up expected values
  * `expectedUrl` => `https://api.themoviedb.org/3/movie/popular`
  * `expectedMethod` => 'GET'
* set up mock data to send via the `HttpClient`
  * `mockResult` => `{ results: mockMovies }`
* subscribe to the services `getMovieList` method with a category to test for
  * `expect` the returned value to be `mockMovies`
* set up http request by providing the `expectedUrl` to `httpTestingController#expectOne`
* expect the requests `method` to be `expectedMethod`
* send the mocked data via the HttpRequest by `flush`ing the request with the `mockResult` value
* finally, `verify` that the `httpTestingController` has no outstanding requests

Useful links:
* [testing http requests](https://angular.io/guide/http#testing-http-requests)

<details>
    <summary>set up expected values & mock data</summary>

```ts
// movie.service.spec.ts

// Arrange
const expectedUrl = 'https://api.themoviedb.org/3/movie/popular';
const expectedMethod = 'GET';
const mockResult = {
    results: mockMovies,
};

```

</details>

<details>
    <summary>set up service call</summary>

```ts
// movie.service.spec.ts

// act: call the `getMovieList` method
service.getMovieList('popular').subscribe({
    next: (movies) => {
        // assert that getMovieList will return the mocked movies
        // coming from the http service
        expect(movies).toEqual(mockMovies);
    },
});

```

</details>

<details>
    <summary>set up request and expect method</summary>

```ts
// movie.service.spec.ts

// The following `expectOne()` will match the request's URL.
// If no requests or multiple requests matched that URL
// `expectOne()` would throw.
const req = httpTestingController.expectOne(expectedUrl);

// Assert request is GET
expect(req.request.method).toEqual(expectedMethod);

```

</details>

<details>
    <summary>send data and verify</summary>

```ts
// movie.service.spec.ts

// Respond with mock data, causing the observable to resolve.
req.flush(mockResult);

// Finally, assert that there are no outstanding requests.
httpTestingController.verify();

```

</details>

<details>
    <summary>set up expected values</summary>

```ts
// movie.service.spec.ts

```

</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --runTestsByPath ./src/app/movie/movie.service.spec.ts
```

### should throw an error

In this test scenario we want to make sure that the method `getMoviesByCategory` is forwarding errors coming from
the http data source.

For this to work we need to do the following steps:

* create test case `it('should throw an error', /* ... */)`
* set up expected values
    * `expectedUrl` => `https://api.themoviedb.org/3/movie/popular`
    * `expectedMethod` => 'GET'
* set up mock data to send via the `HttpClient`
    * `mockError` => `ProgressEvent('error')`
* subscribe to the services `getMovieList` method with a category to test for
    * `expect` the returned value to be `mockError`
    * _hint: `next` should not emit any value anymore, use `error` instead (`error: HttpErrorResponse`)_
* set up http request by providing the `expectedUrl` to `httpTestingController#expectOne`
* expect the requests `method` to be `expectedMethod`
* send the mocked data via the HttpRequest by `error`ing the request with the `mockError` value
* finally, `verify` that the `httpTestingController` has no outstanding requests

Useful links:
* [testing for errors](https://angular.io/guide/http#testing-for-errors)

<details>
    <summary>set up expected values & mock data</summary>

```ts
// movie.service.spec.ts

// Arrange
const expectedUrl = 'https://api.themoviedb.org/3/movie/popular';
const expectedMethod = 'GET';
// Create mock ProgressEvent with type `error`, raised when something goes wrong
// at network level. e.g. Connection timeout, DNS error, offline, etc.
const mockError = new ProgressEvent('error');

```

</details>

<details>
    <summary>set up service call</summary>

```ts
// movie.service.spec.ts

// act: call the `getMovieList` method
service.getMovieList('popular').subscribe({
    // assert that getMovieList will return the mocked movies
    // coming from the http service
    error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
    },
});

```

</details>

<details>
    <summary>set up request and expect method</summary>

```ts
// movie.service.spec.ts

// The following `expectOne()` will match the request's URL.
// If no requests or multiple requests matched that URL
// `expectOne()` would throw.
const req = httpTestingController.expectOne(expectedUrl);

// Assert request is GET
expect(req.request.method).toEqual(expectedMethod);

```

</details>

<details>
    <summary>send data and verify</summary>

```ts
// movie.service.spec.ts

// Throw error through http client, causing the observable to raise an error.
req.error(mockError);

// Finally, assert that there are no outstanding requests.
httpTestingController.verify();

```

</details>

Execute the test suite and watch your test fail or pass :)

```bash
npm run test -- --runTestsByPath ./src/app/movie/movie.service.spec.ts
```
