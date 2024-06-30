# Exercise: angular setup

This exercise should be seen as an introduction session into the `@angular/cli`.
You will learn all the basic commands you need to know in order make your live as a developer easier
when maintaining an angular project.

## Make sure you have `node 16` running

e.g. 
```bash
node -v
v16.16.0
```

## Install global cli

First of all, check if you already have a version installed

```bash
ng version
```

Check if the version matches the current latest version `14.1.x`.

If so, you can skip the uninstallation.

```bash
# if already installed with a lower version

npm uninstall -g @angular/cli

npm i @angular/cli@latest -g
```

Output
```bash
+ @angular/cli@14.1.2
added 1 package from 1 contributor and updated 2 packages in ...
```

## Create angular project

Start a new terminal session in case u did an update or uninstalled
a previous version

```bash
ng new ng-basic-ws
```

You will be asked if you want routing, select `n` for now.
Also, choose a stylesheet format. The choice doesn't change the outcome of this exercise

```bash
? Would you like to add Angular routing? No
? Which stylesheet format would you like to use? 
  CSS 
❯ SCSS   [ https://sass-lang.com/documentation/syntax#scss                ] 
  Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ] 
  Less   [ http://lesscss.org                                             ] 

```

## Open Project in IDE

```bash
code ./ng-basic-ws
```

## serve application

```bash
ng serve
```

application will be served at `localhost:4200` as default

pro tip: you can let the cli open your browser on the served host:port pattern with the `-o` argument

```bash
ng serve -o
```

## say hello world

go `src/app/app.component.html` and change its contents.
watch the application being rebuilt automatically after you have
changed the code.

You can choose if you want to remove everything or just change slices of 
code.

e.g.

```html
My first angular application, great :)
```

## test

```bash
ng test
```

A browser should start and display outcome of the default karma tests

Depending on what you have changed in the template before, the test suite
will be either successful or unsuccessful.

Inspect the contents of `src/app/app.component.spec.ts`

change the contents any test case you find
note that the test suite will automatically re-run your tests

as a bonus you might even want to try to fix the test case if it's failing for you

## add a dependency

```bash
ng add @angular/material@13
```

the cli will aks you some questions about how to setup the material package.

It doesn't matter what you choose for this exercise

```bash
? Choose a prebuilt theme name, or "custom" for a custom theme: Indigo/Pink        [ Preview: 
https://material.angular.io?theme=indigo-pink
 ] 
? Set up global Angular Material typography styles? No   
? Set up browser animations for Angular Material? No 

```

## (update a dependency)

> for this to work you need to have added @angular/material with version 13 :) 

```bash
ng update @angular/material --allow-dirty
```


## build

create a production build of the application

```bash
ng build
```

inspect the output in the `dist/` folder, your app should have been generated there

## caching

You should notice that a directory `.angular/cache` was created.  
Please stop any running process before continuing.

Run `ng build`, you should notice it runs quite fast.

Now remove the `.angular/.cache` folder completely and rebuild the application
with `ng build`.

The process should be much slower compared to the run before.

