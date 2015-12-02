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
      var point = new Point(10,Quick.getHeight() - 20);
      high.setPosition(point);
      this.add(high);

      var score = new Text('score 00000');
      var point = new Point(10,Quick.getHeight() - 30);
      score.setPosition(point);
      this.add(score);
      
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

  var Shot = (function() {
    var SPEED = 8;
    
    function Shot() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('shot'));
      
      this.setSolid();
			this.setSpeedX(SPEED);
			
    }; Shot.prototype = Object.create(GameObject.prototype);
  
    Shot.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
      
		};
  
    return Shot;
  })();
  
  var Enemy = (function() {
    var SPEED = 2;
    
    function Enemy() {
      GameObject.call(this);
      
      this.setImage(document.getElementById('enemy'));
      
      this.setSolid();
      
      var point = new Point(Quick.getWidth(),Quick.random(Quick.getHeight()));
      this.setPosition(point);
			this.setSpeedX(-SPEED);
			
    }; Enemy.prototype = Object.create(GameObject.prototype);
  
    Enemy.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
      
      this.setImageId('explosion');
      this.setExpiration(10);

      this.expire();
      
      var enemy = new Enemy();
      this.getScene().add(enemy);
      

      
			console.log('Explode');
		};
    
    
  
    return Enemy;
  })();  
  
	// class Player extends GameObject
	var Player = (function () {

		var SPEED = 3;

		function Player() {
			GameObject.call(this);
			this.controller = Quick.getController();
      
      this.setImage(document.getElementById('ship'));
      
		}; Player.prototype = Object.create(GameObject.prototype);

		Player.prototype.respond = function () {
			if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
				this.moveX(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
				this.moveX(SPEED);
			}

			if (this.controller.keyDown(CommandEnum.UP) && this.getTop() > 0) {
				this.moveY(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.DOWN) && this.getBottom() < Quick.getHeight()) {
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
