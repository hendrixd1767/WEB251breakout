 // Create the state that will contain the whole game


var mainState = {  
    preload: function() {  
        // Here we preload the assets
		game.load.image('paddle', 'assets/paddle.png');
		//game.load.image('brick', 'assets/brick.png');
		game.load.image('ball', 'assets/ball.png');
		game.load.audio('jump', 'assets/jump.wav');
		game.load.spritesheet('brick', 'assets/blocks2.png',36,20,7);
		game.load.image('sky1', 'assets/sky1.png');
		game.load.audio('stomp', 'assets/stomp.wav');
		game.load.image('horizontalright', 'assets/horizontalright.png');
		game.load.image('horizontalleft', 'assets/horizontalleft.png');
		game.load.image('submit', 'assets/submit.png');
		
		
		// Initialize Firebase
		if (!this.config) {
			
			//var web251-breakout = web251-breakout || {};
			
			this.config = {
				apiKey: "AIzaSyDJstkoi_R0ejb5MVYnZWu4d3fn0izQ4kQ",
				authDomain: "web251-breakout.firebaseapp.com",
				databaseURL: "https://web251-breakout.firebaseio.com",
				projectId: "web251-breakout",
				storageBucket: "web251-breakout.appspot.com",
				messagingSenderId: "883860662809"
			};
	
			firebase.initializeApp(this.config);
			//console.log(firebase);
			
			this.database = firebase.database();
			this.ref = this.database.ref('scores');
			
			//var data = {
				//name: "debbie",
				//score: 400
			//}
			//ref.push(data);
			
		}
	
    },
	

    create: function() {  
        // Here we create the game	
		
		this.stompSound = game.sound.add('stomp');
		
		this.sky1 = this.game.add.tileSprite(0,0,400,450, 'sky1');
		this.world.sendToBack(this.sky1);

		// Start the Arcade physics system (for movements and collisions)
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add the physics engine to all the game objetcs
		game.world.enableBody = true;
		
		 // Create the left/right arrow keys
		this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		// Add the paddle at the bottom of the screen
		this.paddle = game.add.sprite(200, 390, 'paddle');
		this.paddle.scale.setTo(.3);
            

		// Make sure the paddle won't move when it hits the ball
		this.paddle.body.immovable = true;
		
		// Create a group that will contain all the bricks
		this.bricks = game.add.group();  

		// Add 25 bricks to the group (5 columns and 5 lines)
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				// Create the brick at the correct position
				var brick = game.add.sprite(55+i*60, 55+j*35, 'brick');
				//brick.frame=0;
				brick.frame=Math.floor(Math.random() * 7);
				
				brick.scale.setTo(1.3);

				// Make sure the brick won't move when the ball hits it
				brick.body.immovable = true;

				// Add the brick to the group
				this.bricks.add(brick);
			}
		}
		
		// Add the ball 
		this.ball = game.add.sprite(200, 300, 'ball');
		this.ball.scale.setTo(.1);

		// Give the ball some initial speed
		this.ball.body.velocity.x = 150;
		this.ball.body.velocity.y = 150;

		// Make sure the ball will bounce when hitting something
		this.ball.body.bounce.setTo(1); 
		this.ball.body.collideWorldBounds = true;
		
		this.score = 0;
		this.scoreText = game.add.text(25, 380, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
		this.lives = 3;
		
		this.livesText = game.add.text(325, 380, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
		//introText.anchor.setTo(0.5, 0.5);
		
		//add left and right buttons
		
		buttonleft = game.add.button(170, 410, 'horizontalleft', null, this, 0, 1, 0, 1);
		buttonleft.fixedToCamera = true;
		buttonleft.events.onInputOver.add(function(){left=true;});
		buttonleft.events.onInputOut.add(function(){left=false;});
		buttonleft.events.onInputDown.add(function(){left=true;});
		buttonleft.events.onInputUp.add(function(){left=false;});

		buttonright = game.add.button(220, 410, 'horizontalright', null, this, 0, 1, 0, 1);
		buttonright.fixedToCamera = true;
		buttonright.events.onInputOver.add(function(){right=true;});
		buttonright.events.onInputOut.add(function(){right=false;});
		buttonright.events.onInputDown.add(function(){right=true;});
		buttonright.events.onInputUp.add(function(){right=false;});
		
		//initialInput = createInput('name');
		//submitButton = game.add.button(10, 20, 'submit', null, this, 0, 1, 0, 1);
		//submitButton.onInputDown(submitScore);
		
    },
	
	submitScore: function() {
		var data = {
		initials: this.name,
			score: this.score
		}
	console.log(data);
	
	var ref = this.database.ref('scores');
			
	ref.push(data);
	
	},
	
	paddleOut: function() {

		//  Move the paddle to the middle of the screen again
		//this.paddle.reset(this.paddle.y, 200);
		this.paddle.x=200;
	},

 
    update: function() {  
        // Here we update the game 60 times per second
		 // Move the paddle left/right when an arrow key is pressed
		//if (this.left.isDown) this.paddle.body.velocity.x = -200;
		//else if (this.right.isDown) this.paddle.body.velocity.x = 200;

			// define what should happen when a button is pressed
		if (left) 
			this.paddle.body.velocity.x= -200;
				else if (right) 
			this.paddle.body.velocity.x = 200;		

			// Stop the paddle when no key is pressed
		else this.paddle.body.velocity.x = 0; 
		
		this.paddle.checkWorldBounds = true;
        this.paddle.events.onOutOfBounds.add(this.paddleOut, this);
		
		
		

		// Add collisions between the paddle and the ball
		game.physics.arcade.collide(this.paddle, this.ball);


		// Call the 'hit' function when the ball hits a brick
		game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
			
		// Restart the game if the ball is below the paddle
		if (this.ball.y > this.paddle.y) {
			//game.state.start('main'); 
			this.lives=this.lives - 1;
			this.livesText.text = 'Lives: ' + this.lives;
			if (this.lives <= 0) {
				this.gameover();
			} 
			else {
				//reset ball
				this.resetball();
			}
		}
			
	},
	
	resetball: function() {
		// put the ball back in play
		// Add the ball 
		//this.ball = game.add.sprite(200, 300, 'ball');
		this.ball.body.x = 150;
		this.ball.body.y = 250;
		// Give the ball some initial speed
		this.ball.body.velocity.x = 150;
		this.ball.body.velocity.y = 150;
	},
	gameover: function() {
		//alert("Game Over");
		this.name = prompt("Enter your name:");
		this.submitScore();
		
		//game.state.start('main');
		this.resetball();
		this.lives = 3;
		this.score = 0;
	},
	

	// New function that removes a brick from the game
	hit: function(ball, brick) {	
		this.stompSound.play();
		// Only destroy brick if it is on last hit.
		
		if (brick.frame <= 0){
			
			brick.kill();
						//Add and update the score
			this.score += 50;
			this.scoreText.text = 'Score: ' + this.score;
			

			
			
			if (this.score >= 500)
			{
				this.paddle.scale.setTo(.2);
				this.ball.body.velocity.x = 200;
				this.ball.body.velocity.y = 200;
			}
			
		}
		//Multi hit bricks lose one color
		brick.frame=brick.frame - 1;
		//Add and update the score
		this.score += 10;
		this.scoreText.text = 'Score: ' + this.score;

	},
	
};

// Initialize the game and start our state
var game = new Phaser.Game(400, 450);

//global variablesvariables

var left=false;
var right=false;
var paddle;
var initialInput;
var submitButton;
var database;

game.state.add('main', mainState);  
game.state.start('main');