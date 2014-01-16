(function ($) {
	$.fn.blocks14 = function(options) {
	
		var settings = $.extend({
			playerWidth: 100,
			playerHeight: 10,
			playerColor: "#000000", // Color of player
			playerSpeed: 7, // Speed of player
			playerNegativeScoreOn: true, // If player hit should give negative score or not
			playerNegativeScore: 1, // Minus points per player hit
			blockWidth: 50,
			blockHeight: 20,
			blockMargin: 5, // Margin to right and bottom of Block
			blockColors: [{color:"#000000"}],
			blockColorScheme: 1, // 0 = Block, 1 = Row, 2 = Column
			blockScore: 10, // Points per block hit
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
		}, options);
		
		var canvas, ct, player, ball, width, height, points;
		
		var blocks = [];
		
		/** 
		 * Shim layer, polyfill, for requestAnimationFrame with setTimeout fallback.
		 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		 */ 
		window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       || 
		          window.webkitRequestAnimationFrame || 
		          window.mozRequestAnimationFrame    || 
		          window.oRequestAnimationFrame      || 
		          window.msRequestAnimationFrame     || 
		          function( callback ){
		            window.setTimeout(callback, 1000 / 60);
		          };
		})();
		
		
		
		/**
		 * Shim layer, polyfill, for cancelAnimationFrame with setTimeout fallback.
		 */
		window.cancelRequestAnimFrame = (function(){
		  return  window.cancelRequestAnimationFrame || 
		          window.webkitCancelRequestAnimationFrame || 
		          window.mozCancelRequestAnimationFrame    || 
		          window.oCancelRequestAnimationFrame      || 
		          window.msCancelRequestAnimationFrame     || 
		          window.clearTimeout;
		})();
		
		/**
		 * Trace the keys pressed
		 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
		 */
		window.Key = {
		  pressed: {},
		
		  LEFT:   37,
		  RIGHT:  39,
		  R:	  82,
		  S:	  83,
		  SPACE:  32,
		  
		  isDown: function(keyCode, keyCode1) {
		    return this.pressed[keyCode] || this.pressed[keyCode1];
		  },
		  
		  onKeydown: function(event) {
		    this.pressed[event.keyCode] = true;
		    //console.log(event.keyCode);
		  },
		  
		  onKeyup: function(event) {
		    delete this.pressed[event.keyCode];
		  }
		};
		window.addEventListener('keyup',   function(event) { Key.onKeyup(event); },   false);
		window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
		
		
		/**
		 * All objects are Vectors, holding the position of an object
		 */
		function Vector(x,y){
			this.x = x || 0;
			this.y = y || 0;
		};
		
		/**
		 * All objects have bounds
		 */
		function Rectangle(position,width,height){
			this.position = position || new Vector();
			this.width = width || 0;
			this.height = height || 0;
		};
		
		Rectangle.prototype.valueInRange = function(value, min, max) {
			return value >= min && value <= max;
		}
		
		Rectangle.prototype.intersects = function(r){
			var xo = this.valueInRange(r.position.x, this.position.x, this.position.x + this.width) || this.valueInRange(this.position.x, r.position.x, r.position.x + r.width),
				yo = this.valueInRange(r.position.y, this.position.y, this.position.y + this.height) || this.valueInRange(this.position.y, r.position.y, r.position.y + r.height);
			return xo && yo;
		};
		
		Rectangle.prototype.sideHit = function(pr){
			var center = new Vector(pr.position.x + pr.width/2, pr.position.y + pr.height/2);
			
			return this.valueInRange(center.y, this.position.y, this.position.y+this.height) && !this.valueInRange(center.x, this.position.x, this.position.x+this.width);
		};
		
		/**
		 * Player is an object
		 */
		function Player(position, width, height, speed, color){
			this.position = position || new Vector();
			this.width = width || 100;
			this.height = height || 10;
			this.speed = speed || 7;
			this.color = color || settings.baseColor;
			this.sectionWidth = this.width/5;
		};
		
		Player.prototype.getBounds = function() {
			return new Rectangle(this.position, this.width, this.height);
		};
		
		Player.prototype.getSectionBounds = function(section) {
			return new Rectangle(new Vector(this.position.x + this.sectionWidth*section, this.position.y), this.sectionWidth, this.height);
		};
		
		Player.prototype.moveLeft = function() {
			this.position.x -= this.speed;
			if(this.position.x < 0)
				this.position.x = 0;
		};
		
		Player.prototype.moveRight = function() {
			this.position.x += this.speed;
			if(this.position.x + this.width > width)
				this.position.x = width - this.width;
		};
		
		Player.prototype.update = function() {
			if(Key.isDown(Key.LEFT))
				this.moveLeft();
			if(Key.isDown(Key.RIGHT))
				this.moveRight();
		};
		
		Player.prototype.draw = function(ct) {
			ct.fillStyle = this.color;
			ct.fillRect(this.position.x, this.position.y, this.width, this.height);
			ct.fillStyle = settings.baseColor;
		};
		
		/**
		 * Ball is an object
		 */
		function Ball(position, direction, width, height, color){
			this.defaultPosition = position || new Vector();
			this.defaultDirection = direction || new Vector(1,1);
			this.position = new Vector(this.defaultPosition.x, this.defaultPosition.y);
			this.previousPosition = new Vector();
			this.direction = new Vector(this.defaultDirection.x, this.defaultDirection.y);
			this.width = width;
			this.height = height;
			this.color = color || settings.baseColor;
		};
		
		Ball.prototype.getBounds = function() {
			return new Rectangle(this.position, this.width, this.height);
		};
		
		Ball.prototype.getPreviousBounds = function() {
			return new Rectangle(this.previousPosition, this.width, this.height);
		};
		
		Ball.prototype.checkCollision = function(xmax, ymax, ymaxmax, player, blocks) {
			
			// Check if ball hit any of the walls, bounce it back
			if(this.position.x < 0) {
				this.direction.x *= -1;
			}
			
			if(this.position.y < 0) {
				this.direction.y *= -1;
			}
			
			if(this.position.x + this.width > xmax) {
				this.direction.x *= -1;
			}
			
			// Check if ball is about to first level of floor
			if(this.position.y + this.height > ymax) {
			
				// Check if it hits player
				if(this.getBounds().intersects(player.getBounds())) {
					for(var i=0;i<5;i++) {
					
						// Check what speed should be set
						if(this.getBounds().intersects(player.getSectionBounds(i))) {
							switch(i) {
								case 0:
									this.direction.x = -3;
									this.direction.y = -3;
									break;
								case 1:
									this.direction.x = -2;
									this.direction.y = -4;
									break;
								case 2:
									this.direction.y *= -1;
									break;
								case 3:
									this.direction.x = 2;
									this.direction.y = -4;
									break;
								case 4:
									this.direction.x = 3;
									this.direction.y = -3;
									break;
							}
							
							i=5;
						}
					}
					
					if(settings.playerNegativeScoreOn) {
						points -= settings.playerNegativeScore;
						if(points < 0)
							points = 0;
					}
				} 
				
				// Check if it has hit final floor
				if(this.position.y > ymaxmax) {
					this.direction.y = 0;
					this.direction.x = 0;
				}
			}
			
			var didHit = false;
			
			// Loop through the blocks and see if it did hit any of them
			for(var i=0;i<blocks.length && !didHit;i++) {
			
				if(blocks[i].getBounds().intersects(this.getBounds()) && blocks[i].active) {
					//console.log("Hello im hitting his blocks");
					if(blocks[i].getBounds().sideHit(this.getPreviousBounds())) {
						this.direction.x *= -1;
					} else {
						this.direction.y *= -1;
					}
					blocks[i].active = false;
					didHit = true;
					points += settings.blockScore;
				}
			}
		};
		
		Ball.prototype.reset = function() {
			this.position.x = this.defaultPosition.x;
			this.position.y = this.defaultPosition.y;
			this.direction.x = this.defaultDirection.x;
			this.direction.y = this.defaultDirection.y;
		};
		
		Ball.prototype.move = function() {
			this.previousPosition.x = this.position.x;
			this.previousPosition.y = this.position.y;
			this.position.x += this.direction.x;
			this.position.y += this.direction.y;
		};
		
		Ball.prototype.update = function() {
			if(Key.isDown(Key.R))
				this.reset();
			if((Key.isDown(Key.SPACE) || Key.isDown(Key.S)) && this.direction.x === 0 && this.direction.y === 0)
				this.direction.y = 3;
			this.move();
		};
		
		Ball.prototype.draw = function(ct) {
			ct.fillStyle = this.color;
			ct.fillRect(this.position.x, this.position.y, this.width, this.height);
			ct.fillStyle = settings.baseColor;
		};
		
		/**
		 * Block is an object 
		 */
		function Block(position, width, height, color) {
			this.position = position || new Vector();
			this.width = width || 0;
			this.height = height || 0;
			this.color = color || settings.baseColor;
			this.active = true;
		};
		
		Block.prototype.getBounds = function() {
			return new Rectangle(this.position, this.width, this.height);
		};
		
		Block.prototype.reset = function() {
			this.active = true;
		};
		
		Block.prototype.update = function() {
			if(Key.isDown(Key.R))
				this.reset();
		};
		
		Block.prototype.draw = function(ct) {
			if(this.active) {
				ct.fillStyle=this.color;
				ct.fillRect(this.position.x, this.position.y, this.width, this.height);
				ct.fillStyle=settings.baseColor;
			}
		};
		
		function drawPoints(ct) {
			ct.font = settings.scoreFontStyleSize;
			ct.fillStyle = settings.scoreFontColor;
			ct.fillText(""+points, 5, height-player.height-10);
			ct.fillStyle = settings.baseColor;
		}
			
		function init(can) {
			canvas = can.get(0);
			ct = canvas.getContext("2d");
			width = canvas.width;
			height = canvas.height;
			player = new Player(new Vector(width/2-50, height-settings.playerHeight), settings.playerWidth, settings.playerHeight, settings.playerSpeed, settings.playerColor);
			ball = new Ball(new Vector(width/2-5, height-settings.playerHeight-settings.ballHeight-settings.blockMargin-3), new Vector(0, 0), settings.ballWidth, settings.ballHeight, settings.ballColor);
			points = 0;
			
			if(settings.autoLeftMargin) {
				settings.leftMargin = (width % (settings.blockWidth+settings.blockMargin)) / 2 + Math.floor(settings.blockMargin/2);
			}
			
			if(settings.autoTopMargin) {
				settings.topMargin = (height % (settings.blockHeight+settings.blockMargin)) / 2;
			}

			var blockGroupHeight = height/2-settings.topMargin,
				blockGroupWidth = width+Math.floor(settings.blockMargin/2)-settings.leftMargin,
				verticalBlocks = Math.floor(blockGroupHeight/(settings.blockHeight+settings.blockMargin)),
				horizontalBlocks = Math.floor(blockGroupWidth/(settings.blockWidth+settings.blockMargin)),
				blockHeightCounter = 0,
				colorCount = 0;
				
			for(var i=0;i<verticalBlocks*horizontalBlocks;i+=horizontalBlocks) {
								
				for(var j=0;j<horizontalBlocks;j++) {
							
					blocks[i+j] = new Block(new Vector((settings.blockWidth+settings.blockMargin)*j+settings.leftMargin,blockHeightCounter+settings.topMargin), settings.blockWidth, settings.blockHeight, settings.blockColors[colorCount].color);
					
					if(settings.blockColorScheme == 0 || settings.blockColorScheme == 1) {
						colorCount++;
						if(colorCount >= settings.blockColors.length) {
							colorCount = 0;
						}
					}
				}
				
				if(settings.blockColorScheme == 1 || settings.blockColorScheme == 2) {
					colorCount++;
					if(colorCount >= settings.blockColors.length) {
						colorCount = 0;
					}
				}
				
				if(settings.blockColorScheme == 1)
					colorCount = 0;
				
				
				blockHeightCounter += settings.blockHeight + settings.blockMargin;
			}
			
			gameLoop();
		};
			
		function update() {
			player.update();
			ball.update();
			ball.checkCollision(width, height-player.height, height, player, blocks);
			for(var i=0;i<blocks.length;i++)
				blocks[i].update();
			if(Key.isDown(Key.R))
				points = 0;
		};
			
		function render() {
			ct.clearRect(0,0,width,height);
			player.draw(ct);
			ball.draw(ct);
			for(var i=0;i<blocks.length;i++) {
				blocks[i].draw(ct);
			}
			drawPoints(ct);
		};
		
		function gameLoop() {
			lastGameTick = Date.now();
			requestAnimFrame(gameLoop);
			update();
			render();
		};
		
		init(this);
	}
	
}(jQuery));