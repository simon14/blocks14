# Configuration guide


### Configuration Example

To add a option to ```.blocks14()```, e.g. changing the ```playerWidth```, do the following:

```javascript
$.("#gameboard").blocks14({
		playerWidth: 200
});
```


### Dimension

The dimensions of objects can be configured with width and height using the following options:

```javascript
playerWidth: 100
playerHeight: 10

blockWidth: 50
blockHeight: 20

ballWidth: 10
ballHeight: 10
```

### Colors

You can change the colors of the player, the ball and the blocks. Player, ball and score got a single color option while the blocks have multicolor options.

Player and ball

```javascript
playerColor: "#000000"
ballColor: "#000000"
scoreColor: "#000000"
```

Single block color

```javascript
blockColors: [{color:"#000000"}]
```

Multiple block color

```javascript
blockColors: [{color:"#000000"}, {color:"#0000FF"}, {color:"#00FF00"}]
```

When using multiple block color you can decide how the colors should be used.

```javascript
blockColorScheme: 1
```

Where ```0``` will be block-wise coloring. Every block will pick a color from the available colors. 

Other option is  ```1``` which is column-wise coloring and ```2``` which is line-wise coloring. Compared to block-wise coloring, where every block get a own color, this will instead give every column/line an own color. While every block in that column/line will have the same color.

### Score

You can adjust how the score is calculated for the game.

```javascript
blockScore: 10
playerNegativeScore: 1
playerNegativeScore: true
```

The option ```blockScore``` decides the amount of points awarded for every block destroyed. ```playerNegativeScore``` decides the amount of negative score that will be withdrawn for every time the ball hits the player. ```playerNegativeScore``` turns the negative score ON or OFF.

### Margin and other styling

There is a few alternatives to style the game. Margins will allow you to decide the space between the blocks but also how far from the edges the blockgroup will be.

Block

```javascript
blockMargin: 5
```
This will give every block a margin of 5px to the right side and the bottom.

Block group

```javascript
topMargin: 20
leftMargin: 10
```
Here would ```topMargin``` add 20px's of whitespace above the group of blocks and ```leftMargin``` would add 10px's of whitespace to the left of the block group.

The font style and size for the score counter is also adjustable. 
```javascript 
scoreFontStyleSize: "bold 16px Consolas"
```