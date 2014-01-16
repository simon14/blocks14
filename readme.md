# Blocks14 - A jQuery plugin

A simple [BreakOut]() game built as a jQuery plugin. 

## Installation

1. Make sure you got [jQuery](http://jquery.com/).
2. Download [blocks14.js](https://github.com/simonibitar/blocks14/blob/master/blocks14.js) and add it to your website files.
3. Add a reference to ```blocks14.js```.

```html
<script src="/path/to/blocks14.js"></script>
```

**Note:** Make sure to include it *after* the jQuery library.

## Usage

Create a canvas element that should serve as the gameboard. Specify the dimensions of the canvas here as well. Give it an ```#id``` so you can identify it easier in the JavaScript.

```html
<canvas id="gameboard" width="500px" height="300px"></canvas>
```

In your JavaScript add a jQuery element containing the canvas. Add the game to it.

```javascript
$("#gameboard").blocks14();
```

This should initiate the game and start it. Done!

## Configuration

When adding ```.blocks14()```, you can choose to configure the options for the game. There is basic options for setting the width and height of things. But also the speed, score and colors.

All the available options are the following:

```javascript
.blocks14({
	playerWidth: 100,
	playerHeight: 10,
	playerColor: "#000000",
	playerSpeed: 7,
	playerNegativeScoreOn: true,
	playerNegativeScore: 1,
	blockWidth: 50,
	blockHeight: 20,
	blockMargin: 5,
	blockColors: [{color:"#000000"}],
	blockColorScheme: 1,
	blockScore: 10,
	ballWidth: 10,
	ballHeight: 10,
	ballColor: "#000000",
	topMargin: 20,
	leftMargin: 10,
	autoTopMargin: true,
	autoLeftMargin: true,
	scoreFontStyleSize: "16px Consolas",
	scoreFontColor: "#000000", 
	baseColor: "#000000"
});
```

For a full specification and description of the options please see [configuration.md](https://github.com/simonibitar/blocks14/blob/master/configuration.md).

## Demo
 
Two demos can be found here: [Demo 1](http://www.student.bth.se/~sihf11/javascript/blocks14/demo1/), [Demo 2](http://www.student.bth.se/~sihf11/javascript/blocks14/demo2/)
You can also download the [example]() code from this repository.

## Author
[Simon H](https://github.com/simonibitar/)
