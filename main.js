(function () {

	"use strict";

	// imports
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;
  var Sprite = com.dgsprb.quick.Sprite;
  var Point = com.dgsprb.quick.Point;
  var Text = com.dgsprb.quick.Text;

	
  var totalScore = 0;
  var score = new Text('score ' + totalScore);
  var barLevel;

	// functions
	function main() {
		Quick.setName("Fighter Champion");
		Quick.init(function () { return new GameScene() });
	}

  // class GameScene extends Scene
	var GameScene = (function () {

		function GameScene() {
			Scene.call(this);
      
			var background = new Background();
			this.add(background);
      
			var player = new Player();
			this.add(player);
      
      var enemy = new Enemy();
      this.add(enemy);
      
      var high = new Text('highscore 10000');
      var point = new Point(20,Quick.getHeight() - 20);
      high.setPosition(point);
      this.add(high);

      
      var point = new Point(20,Quick.getHeight() - 30);

      score.setPosition(point);
      this.add(score);
      
      var planet = new Planet();
      this.add(planet);
      
      var bar = new Bar();
      this.add(bar);
      
      barLevel = new BarLevel()
      this.add(barLevel);
      
		}; GameScene.prototype = Object.create(Scene.prototype);

		return GameScene;

	})();

	// class Background extends GameObject
	var Background = (function () {

		function Background() {
			GameObject.call(this);
			this.setColor("Black");
			this.setHeight(Quick.getHeight());
			this.setWidth(Quick.getWidth());
      
      this.setImage(document.getElementById('bg'));

		}; Background.prototype = Object.create(GameObject.prototype);

		return Background;

	})();

  // the enery bar
  var Bar = (function() {
    function Bar() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('bar'));
      
      var point = new Point(20,Quick.getHeight() - 60);
      this.setPosition(point);
      
    }; Bar.prototype = Object.create(GameObject.prototype);
    
    return Bar;
  })();
  
  // the energy bar level
  var BarLevel = (function() {
    function BarLevel() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('bar-level'));
      
      var point = new Point(20,Quick.getHeight() - 60);
      this.setPosition(point);
      this.setImageId('bar-level');
      this.addTag('bar-level');
      
      
    }; BarLevel.prototype = Object.create(GameObject.prototype);
    
    return BarLevel;
  })();
  
  // the ship shot
  var Shot = (function() {
    var SPEED = 8;
    
    function Shot() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('shot'));
      
      this.setSolid();
			this.setSpeedX(SPEED);
			this.setBoundary(Quick.getBoundary());
      
    }; Shot.prototype = Object.create(GameObject.prototype);
  
    Shot.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
      
		};
  
    return Shot;
  })();
  
  var Enemy = (function() {
    var SPEED = 8;
    
    function Enemy() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('enemy'));
      
      this.setSolid();
      
      var point = new Point(Quick.getRight(),Quick.random(Quick.getBottom()-20));
      this.setPosition(point);
			this.setSpeedX(-SPEED);
      this.addTag('enemy');
      this.setBoundary(Quick.getBoundary());
			
    }; Enemy.prototype = Object.create(GameObject.prototype);
  
    Enemy.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
      
      this.setImageId('explosion');
      this.setExpiration(10);

      this.expire();
      
      var enemy = new Enemy();
      this.getScene().add(enemy);
			console.log('Explode');
      
      try{
        totalScore += 10;
        score.string = 'score ' + totalScore;
      }catch(i){
        console.log(i);
      }
      
		};
    
    Enemy.prototype.offBoundary = function() {
      GameObject.prototype.offBoundary.call(this);
      
      this.getScene().add(new Enemy());
    }
  
    return Enemy;
  })();  
  
  // class planet ship
  var Planet = (function() {
    function Planet() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('planet'));
      
      this.setHeight(Quick.getHeight());
			this.setWidth(20);
      this.setSolid();
      
      var point = new Point(0,0);
      this.setPosition(point);
      
    }; Planet.prototype = Object.create(GameObject.prototype);
    
    Planet.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
      
      
      
      if(barLevel.getWidth() <= 0) {
        console.log('====================== GAME OVER!!! ======================');
      } else {
        barLevel.increaseWidth(-20);
      }
      
      console.log('planet collision', gameObject);
    }
    
    return Planet;
  })();
  
  
	// class Player extends GameObject
	var Player = (function () {

		var SPEED = 3;

		function Player() {
			GameObject.call(this);
			this.controller = Quick.getController();
      
      this.setImage(document.getElementById('ship'));
      
      var point = new Point(30,0);
      this.setPosition(point);
      
		}; Player.prototype = Object.create(GameObject.prototype);

		Player.prototype.respond = function () {
      /*
			if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
				this.moveX(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
				this.moveX(SPEED);
			}
      */
      
			if (this.controller.keyDown(CommandEnum.UP) && this.getTop() > 0) {
				this.setImage(document.getElementById('ship-top'));
        this.moveY(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.DOWN) && this.getBottom() < Quick.getHeight()) {
      this.setImage(document.getElementById('ship-bottom'));
				this.moveY(SPEED);
			}
      
      if (this.controller.keyPush(CommandEnum.A)) {
        console.log('SHOT');
        
        
        var shot = new Shot();
        var point = new Point(this.getX() + 35, this.getY() + 15);
        shot.setCenter(point);
        this.getScene().add(shot);
      }
		};

		// override
		Player.prototype.update = function () {
			this.respond();
		};

		return Player;

	})();

	main();

})();
