# Title: Refactor Tractor B

A [Front-End Project] by [Robert DeRouin](https://github.com/robertjosephderouin) & [Peter Muellerleile](https://github.com/robertjosephderouin) & [Jon Schlandt](https://github.com/jon-schlandt)

* Project Manager: [Hannah Hudson](https://github.com/hannahhch)

1. [Overview](#overview)
2. [Functionality](#functionality)
3. [Iterations](#iterations)
4. [Technologies](#technologies)
5. [Contributors](#contributors)
6. [Resources](#resources)

## Overview

The Poster Generator website allows users to generate and save random/non-random image, title, quote combinations to create motivational posters.  

## Main Page View

<img width="1058" alt="Screen Shot 2021-02-14 at 11 24 59 AM" src="https://user-images.githubusercontent.com/72281855/107885414-6d7e5b00-6eb7-11eb-90ec-fde257023660.png">

## Saved Poster View

<img width="1374" alt="Screen Shot 2021-02-14 at 11 27 11 AM" src="https://user-images.githubusercontent.com/72281855/107885452-a3bbda80-6eb7-11eb-851f-402d17fac80b.png">

## Functionality

* Current:
  * User can navigate between three views. "Saved posters", "create poster", and "current poster".
  * User can generate a random or custom combination of an image, quote, and title to create a "poster".
  * User can save their poster to the "saved posters" view where it will be added to an array displayed in a grid format.
  * User can delete any poster in the "saved posters" view by double clicking.

* Future Enhancements:
  * Refactor alt text functionality to reduce the length of the images array.
  * Implement data validation and error handling into the form (disable button, provide error messages if data entered is not correct, etc).
  * In the main poster view, allow users to click image, title, quote to update just that piece with another random item from the appropriate array.
  * When a user single clicks a saved poster, create a modal to view it larger.
  * Allow users to drag and drop saved posters into whatever order they want them to appear.

* Known Issues/Bugs:
  * Form has a number of bugs because validation was not part of the base functionality. As an example, if user does not enter poster information on the form view, they can return the main page from the "show my poster" button resulting in an undefined image, title, quote.
  * Buttons are sometimes not responsive when sharing on zoom call screen share mode.

## Technologies

1. HTML
2. CSS
3. JavaScript
4. GitHub (website hosting and source code management)

## Contributors

* Co-Creator: [Robert DeRouin](https://github.com/robertjosephderouin)
* Co-Creator: [Steve Calla](https://github.com/stevecalla)
* Formal Code Review: [Paige Vannelli](https://github.com/PaigeVannelli/PaigeVannelli)
* Project Manager: [Hannah Hudson](https://github.com/hannahhch)

## Resources
* Project Description: https://frontend.turing.io/projects/module-1/hang-in-there.html
* Team GitHub Repo: https://github.com/robertjosephderouin/hang-in-there-boilerplate
* GitHub Hosted URL: https://robertjosephderouin.github.io/hang-in-there-boilerplate/
