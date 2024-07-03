# Exercise: HttpInterceptors

In this exercise you will get to know another very useful tool of angulars `HttpClient`: `HttpInterceptor`s.
`HttpInterceptor`s allow you to define custom behavior which gets applied to any `HttpRequest` fired with the `HttpClient`.
This is especially useful for Errorhandling, Logging and Authentication.

## 1. Introduce ReadAccessInterceptor

Your task is to implement an `HttpInterceptor` which takes care of sending the required `Authorization` header whenever we want to
communicate with the `tmdb` api.

Generate a new interceptor `ReadAccessInterceptor`.

```bash
ng g interceptor read-access
```

The `Interceptor` should add `Authorization: 'Bearer ${environment.tmdbApiReadAccessKey}'` on each request being made.
For this, you want to return `next.handle` and use the `request.clone` method which allows you to `setHeader` the correct values.

If you don't read the solution, you may want to [read here](https://angular.io/guide/http#intercepting-requests-and-responses).

<details>
    <summary>Show Solution</summary>

```ts
// read-access.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../environments/environment';

export const readAccessInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.tmdbApiReadAccessKey}`,
      },
    })
  );
};
```

</details>

Well done, in the next we are going to make use of the new Interceptor!

## 2. Use the readAccessInterceptor

After finishing the implementation, we need to tell the `HttpClient` to use it. Otherwise, our application
doesn't know about its existence and won't execute it at all.

create a [`StaticProvider`](https://angular.io/api/core/StaticProvider) which provides the `ReadAccessInterceptor`
as `HTTP_INTERCEPTORS`. Don't forget to set `multi: true` as `HTTP_INTERCEPTORS` can be provided multiple times.

<details>
    <summary>show solution</summary>

provide the `ReadAccessInterceptor` as `HTTP_INTERCEPTORS` in the `AppModule`

```ts
// app.module.ts
providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ReadAccessInterceptor,
        multi: true
    }
]
```
</details>

> Now that our interceptor is in place, we can remove the manual `header` configurations in all our
> http requests

Serve the application. Make sure the movie values are still being shipped properly.
Double-check in the network tab if the header is still set and the result is still a valid movie list response.

## Bonus: ErrorInterceptor

Implement an interceptor which listens to the response of a request instead.
In case of an error, it should at least `console.error` a message.
In best case it would redirect the user to the `not-found` route when the error is of type `404`.
If you like, you can also send an `alert` to the user.

When u are done implementing it, try to produce an error. You can do it either with `rxjs`, or you can think about a way
dealing with it with the `devtools` :-)

useful resources:
* [blog post](https://dev.to/this-is-angular/angular-error-interceptor-12bg)
* [docs](https://angular.io/guide/http#intercepting-requests-and-responses)
* [alert](https://developer.mozilla.org/de/docs/Web/API/Window/alert)
* [throwError](https://rxjs.dev/api/index/function/throwError)
* [catchError](https://rxjs.dev/api/operators/catchError)
