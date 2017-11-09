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
	
    },
	

    create: function() {  
        // Here we create the game
		// Set the background color to blue
		//game.stage.backgroundColor = '#3598db';
		
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
		this.paddle = game.add.sprite(200, 400, 'paddle');
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
		this.scoreText = game.add.text(25, 400, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
		//livesText = game.add.text(325, 400, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
		//introText.anchor.setTo(0.5, 0.5);
		
		//this.stompSound = game.add.audio('stomp');

		//game.input.onDown.add(releaseBall, this);
    },

    update: function() {  
        // Here we update the game 60 times per second
		 // Move the paddle left/right when an arrow key is pressed
		if (this.left.isDown) this.paddle.body.velocity.x = -300;
		else if (this.right.isDown) this.paddle.body.velocity.x = 300; 

		// Stop the paddle when no key is pressed
		else this.paddle.body.velocity.x = 0; 

		// Add collisions between the paddle and the ball
		game.physics.arcade.collide(this.paddle, this.ball);


		// Call the 'hit' function when the ball hits a brick
		game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
			
		// Restart the game if the ball is below the paddle
		if (this.ball.y > this.paddle.y)
			game.state.start('main');  
	},

	// New function that removes a brick from the game
	hit: function(ball, brick) {	
		this.stompSound.play();
		// Only destroy brick if it is on last hit.
		
		if (brick.frame <= 0){
			
			brick.kill();
			
			//Add and update the score
			this.score += 10;
			this.scoreText.text = 'Score: ' + this.score;
			
			
			if (this.score >= 50)
			{
				this.paddle.scale.setTo(.15);
			}
			
		}
		//Multi hit bricks lose one color
		brick.frame=brick.frame - 1;

	},
	
};

// Initialize the game and start our state
var game = new Phaser.Game(400, 450);

game.state.add('main', mainState);  
game.state.start('main');