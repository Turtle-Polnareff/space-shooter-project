var assetsFolder = 'https://digital-brilliance-hour.github.io/phaser-shooter-base/';

//boot object
var BasicGame = {
  SEA_SCROLL_SPEED: 12,
  PLAYER_SPEED: 300,
  ENEMY_MIN_Y_VELOCITY: 30,
  ENEMY_MAX_Y_VELOCITY: 60,
  SHOOTER_MIN_VELOCITY: 30,
  SHOOTER_MAX_VELOCITY: 80,
  BOSS_Y_VELOCITY: 15,
  BOSS_X_VELOCITY: 200,
  BULLET_VELOCITY: 500,
  ENEMY_BULLET_VELOCITY: 150,
  POWERUP_VELOCITY: 100,

  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,

  SHOT_DELAY: Phaser.Timer.SECOND * 0.1,
  SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 2,
  BOSS_SHOT_DELAY: Phaser.Timer.SECOND,

  ENEMY_HEALTH: 2,
  SHOOTER_HEALTH: 5,
  BOSS_HEALTH: 500,

  BULLET_DAMAGE: 1,
  CRASH_DAMAGE: 5,

  ENEMY_REWARD: 100,
  SHOOTER_REWARD: 400,
  BOSS_REWARD: 10000,
  POWERUP_REWARD: 100,

  ENEMY_DROP_RATE: 0.3,
  SHOOTER_DROP_RATE: 0.5,
  BOSS_DROP_RATE: 0,

  PLAYER_EXTRA_LIVES: 3,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,

  INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 10,
  RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 2
};

BasicGame.Boot = function(game) {

};

BasicGame.Boot.prototype = {

  init: function() {

    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    // this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {
      //  If you have any desktop specific settings, they can go in here 
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      //this.scale.setMinMax(480, 260, 1024, 768);
			this.scale.refresh();

      
    } else {
      //  Same goes for mobile settings.
      //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
    }
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },

  preload: function() {

    //  Here we load the assets required for our preloader (in this case a loading bar)
    this.load.crossOrigin = true;
    this.load.baseURL = 'https://digital-brilliance-hour.github.io/phaser-shooter-base/';
    this.load.image('preloaderBar', 'assets/preloader-bar.png');

  },

  create: function() {

    //  By this point the preloader assets have loaded to the cache, we've set the game settings
    //  So now let's start the real preloader going
    this.state.start('Preloader');

  }

};

//preloading object
BasicGame.Preloader = function(game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function() {

    //  Show the loading progress bar asset we loaded in boot.js
    this.load.crossOrigin = true;
    this.load.baseURL = 'https://digital-brilliance-hour.github.io/phaser-shooter-base/';
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", {
      font: "32px monospace",
      fill: "#fff"
    }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    this.load.image('titlepage', 'assets/titlepage.png');
    this.load.image('sea', 'assets/sea.png');
    this.load.image('sand', 'assets/sand.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemyBullet', 'assets/enemy-bullet.png');
    this.load.image('powerup1', 'assets/powerup1.png');
    this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32, 32);
     this.load.spritesheet('boss', 'assets/boss.png', 93, 75);
     this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
     this.load.spritesheet('player', 'assets/player.png', 64, 64);
     this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
     this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
     this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
     this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
     this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
     this.load.audio('titleMusic', ['assets/bgm/titlemusic.ogg']);
    this.load.audio('stageMusic', ['assets/bgm/stageonemusic.ogg']);
    this.load.audio('bossMusic', ['assets/bgm/bossmusic.ogg']);
    this.load.audio('gameOverMusic', ['assets/bgm/gameovermusic.mp3']);
    //  + lots of other required assets here

  },

  create: function() { 
  

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

  },

  update: function() {

    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.

    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.

    //if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
    //{
    //  this.ready = true;
    this.state.start('MainMenu');
    //}

  }

};

//Main Menu object
BasicGame.MainMenu = function(game) {

  this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	preload: function () {     
		this.load.image('titlepage', 'assets/titlepage.png');   
	},

  create: function() {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //  Here all we're doing is playing some music and adding a picture and button
    //  Naturally I expect you to do something significantly better :)

    this.add.sprite(0, 0, 'titlepage');

    this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Press Z or tap/click game to start", {
      font: "20px monospace",
      fill: "#fff"
    });
    this.loadingText.anchor.setTo(0.5, 0.5);
    // this.add.text(this.game.width / 2, this.game.height - 90, "image assets Copyright (c) 2002 Ari Feldman", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
    //this.add.text(this.game.width / 2, this.game.height - 75, "sound assets Copyright (c) 2012 - 2013 Devin Watson", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
    
      this.music = this.add.audio('titleMusic', 0.5, true);
    this.music.play();

  }, 


  update: function() {

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.startGame();
    }
    //  Do some nice funky main menu effect here

  },

  startGame: function(pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
     this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  }

};

//Game Logic Object
BasicGame.Game = function(game) {

};

BasicGame.Game.prototype = {

 create: function () { 
	this.setupBackground(); 
	this.setupPlayer(); 
	this.setupEnemies(); 
	this.setupBullets(); 
	this.setupExplosions(); 
	this.setupText(); 
  this.setupAudio();
  this.setupPlayerIcons();
	this.cursors = this.input.keyboard.createCursorKeys(); 
},

setupPlayerIcons: function () { 
  this.powerUpPool = this.add.group();     
  	this.powerUpPool.enableBody = true;     
  	this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;     
  	this.powerUpPool.createMultiple(5, 'powerup1');     
  	this.powerUpPool.setAll('anchor.x', 0.5);     
  	this.powerUpPool.setAll('anchor.y', 0.5);     
  	this.powerUpPool.setAll('outOfBoundsKill', true);     
  	this.powerUpPool.setAll('checkWorldBounds', true);     
  	this.powerUpPool.setAll(       
  		'reward', BasicGame.POWERUP_REWARD, false, false, 0, true     
  	);
	this.lives = this.add.group(); 
	// calculate location of first life icon 
	var firstLifeIconX = this.game.width - 10 - (BasicGame.PLAYER_EXTRA_LIVES * 30); 
	for (var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++) { 
		var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player'); 
		life.scale.setTo(0.5, 0.5); 
		life.anchor.setTo(0.5, 0.5); 
	} 
}, 



  update: function () { 
	this.checkCollisions(); 
	this.spawnEnemies(); 
  this.enemyFire();
	this.processPlayerInput(); 
	this.processDelayedEffects(); 
},
  enemyFire: function() { 
	this.shooterPool.forEachAlive(function (enemy) { 
	  	if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) { 
		  	var bullet = this.enemyBulletPool.getFirstExists(false); 
		  	bullet.reset(enemy.x, enemy.y); 
		  	this.physics.arcade.moveToObject( 
		  	bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY 
		  	); 
		  	enemy.nextShotAt = this.time.now + BasicGame.SHOOTER_SHOT_DELAY; 
        this.enemyFireSFX.play();
		} 
	}, this); 
  
  if (this.bossApproaching === false && this.boss.alive &&          
    this.boss.nextShotAt < this.time.now &&         
    this.enemyBulletPool.countDead() >= 10) {        
	    this.boss.nextShotAt = this.time.now + BasicGame.BOSS_SHOT_DELAY;        
	    for (var i = 0; i < 5; i++) {         
	        // process 2 bullets at a time         
	        var leftBullet = this.enemyBulletPool.getFirstExists(false);         
	        leftBullet.reset(this.boss.x - 10 - i * 10, this.boss.y + 20);         
	        var rightBullet = this.enemyBulletPool.getFirstExists(false);         
	        rightBullet.reset(this.boss.x + 10 + i * 10, this.boss.y + 20);          

	        if (this.boss.health > BasicGame.BOSS_HEALTH / 2) {           
		    // aim directly at the player           
		    this.physics.arcade.moveToObject(             
		    	leftBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY           
		    );           
		    this.physics.arcade.moveToObject(             
		    	rightBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY           
		    );         
	        } else {           
			// aim slightly off center of the player           
			this.physics.arcade.moveToXY(             
				leftBullet, this.player.x - i * 100, this.player.y,             
				BasicGame.ENEMY_BULLET_VELOCITY           
			);           

			this.physics.arcade.moveToXY(             
				rightBullet, this.player.x + i * 100, this.player.y,             
				BasicGame.ENEMY_BULLET_VELOCITY     
      
			);         
      
	        }       
					
          this.enemyFireSFX.play();

            }     
    }
},
  fire: function() {
  
  if (!this.player.alive || this.nextShotAt > this.time.now) {       
	  	return;     
	} 
    if (this.bulletPool.countDead() === 0) {       
		return;     
	}

  	this.nextShotAt = this.time.now + this.shotDelay;
    
    this.playerFireSFX.play();

  
 var bullet;     
    if (this.weaponLevel === 0) {       
	    if (this.bulletPool.countDead() === 0) {         
	    	return;        
		}       
		bullet = this.bulletPool.getFirstExists(false);       
		bullet.reset(this.player.x, this.player.y - 20);       
		bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;     
	} else {       
		if (this.bulletPool.countDead() < this.weaponLevel * 2) {         
			return;       
		}       
		for (var i = 0; i < this.weaponLevel; i++) {         
			bullet = this.bulletPool.getFirstExists(false);         
			// spawn left bullet slightly left off center         
			bullet.reset(this.player.x - (10 + i * 6), this.player.y - 20);         
			// the left bullets spread from -95 degrees to -135 degrees         
			this.physics.arcade.velocityFromAngle(           
				-95 - i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity         
			);          
			bullet = this.bulletPool.getFirstExists(false);         
			// spawn right bullet slightly right off center         
			bullet.reset(this.player.x + (10 + i * 6), this.player.y - 20);         
			// the right bullets spread from -85 degrees to -45         
			this.physics.arcade.velocityFromAngle(           
				-85 + i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity         
			);       
		}     
	}
}, 
  


  
render: function() { 
 //   this.game.debug.body(this.bullet);
  //  this.game.debug.body(this.enemy);
  //this.game.debug.body(this.player);
}, 

//  
// create()- related functions  
//  
setupBackground: function () {  
	this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');  
	this.sea.autoScroll(0, BasicGame.SEA_SCROLL_SPEED);  
},  

setupPlayer: function () {  
	this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, 'player');
	this.player.anchor.setTo(0.5, 0.5);  
	this.player.animations.add('fly', [ 0, 1, 2 ], 20, true); 
  this.player.animations.add('ghost', [ 3, 0, 3, 1 ], 20, true);
	this.player.play('fly');  
	this.physics.enable(this.player, Phaser.Physics.ARCADE);  
	this.player.speed = BasicGame.PLAYER_SPEED;  
	this.player.body.collideWorldBounds = true;  
	// 20 x 20 pixel hitbox, centered a little bit higher than the center  
	this.player.body.setSize(20, 20, 22, 13);  
  this.weaponLevel = 0;
},  

setupEnemies: function () { 
	this.enemyPool = this.add.group(); 
	this.enemyPool.enableBody = true; 
	this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE; 
	this.enemyPool.createMultiple(50, 'greenEnemy'); 
	this.enemyPool.setAll('anchor.x', 0.5); 
	this.enemyPool.setAll('anchor.y', 0.5); 
	this.enemyPool.setAll('outOfBoundsKill', true); 
	this.enemyPool.setAll('checkWorldBounds', true); 
  this.enemyPool.setAll('reward', BasicGame.ENEMY_REWARD, false, false, 0, true); 
  this.enemyPool.setAll('dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true);

	// Set the animation for each sprite 
	this.enemyPool.forEach(function (enemy) { 
		enemy.animations.add('fly', [ 0, 1, 2 ], 20, true); 
    
    enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);       
		enemy.events.onAnimationComplete.add( function (e) {         
		e.play('fly');       
		}, this); 
	}); 

	this.nextEnemyAt = 0; 
	this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;
  
  this.shooterPool = this.add.group();     
  	this.shooterPool.enableBody = true;     
  	this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;     
  	this.shooterPool.createMultiple(20, 'whiteEnemy');     
  	this.shooterPool.setAll('anchor.x', 0.5);     
  	this.shooterPool.setAll('anchor.y', 0.5);     
  	this.shooterPool.setAll('outOfBoundsKill', true);     
  	this.shooterPool.setAll('checkWorldBounds', true);     
  	this.shooterPool.setAll(       'reward', BasicGame.SHOOTER_REWARD, false, false, 0, true     );   
    this.shooterPool.setAll('dropRate', BasicGame.SHOOTER_DROP_RATE, false, false, 0, true);
    
  	// Set the animation for each sprite     
  	this.shooterPool.forEach(function (enemy) {       
	  	enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);       
	  	enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);       
	  	enemy.events.onAnimationComplete.add( function (e) {         
		  	e.play('fly');       
		}, this);     
	});      
        // start spawning 5 seconds into the game     
        this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;     
        this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;
        
        this.bossPool = this.add.group();     
  	this.bossPool.enableBody = true;     
  	this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;     
  	this.bossPool.createMultiple(1, 'boss');     
  	this.bossPool.setAll('anchor.x', 0.5);     
  	this.bossPool.setAll('anchor.y', 0.5);     
  	this.bossPool.setAll('outOfBoundsKill', true);     
  	this.bossPool.setAll('checkWorldBounds', true);     
  	this.bossPool.setAll('reward', BasicGame.BOSS_REWARD, false, false, 0, true);     
  	this.bossPool.setAll(       
  		'dropRate', BasicGame.BOSS_DROP_RATE, false, false, 0, true     
  	);      
  	// Set the animation for each sprite     
  	this.bossPool.forEach(function (enemy) {       
	  	enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);       
	  	enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);       
	  	enemy.events.onAnimationComplete.add( function (e) {         
	  		e.play('fly');       
	    }, this);     
        });      
        this.boss = this.bossPool.getTop();     
        this.bossApproaching = false;
  
}, 

setupBullets: function () { 
this.enemyBulletPool = this.add.group();     
  	this.enemyBulletPool.enableBody = true;     
  	this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;     
  	this.enemyBulletPool.createMultiple(100, 'enemyBullet');     
  	this.enemyBulletPool.setAll('anchor.x', 0.5);     
  	this.enemyBulletPool.setAll('anchor.y', 0.5);     
  	this.enemyBulletPool.setAll('outOfBoundsKill', true);     
  	this.enemyBulletPool.setAll('checkWorldBounds', true);     
  	this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);
	// Add an empty sprite group into our game 
	this.bulletPool = this.add.group(); 

	// Enable physics to the whole sprite group 
	this.bulletPool.enableBody = true; 
	this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE; 

	// Add 100 'bullet' sprites in the group. 
	// By default this uses the first frame of the sprite sheet and 
	//   sets the initial state as non-existing (i.e. killed/dead) 
	this.bulletPool.createMultiple(100, 'bullet'); 

	// Sets anchors of all sprites 
	this.bulletPool.setAll('anchor.x', 0.5); 
	this.bulletPool.setAll('anchor.y', 0.5); 

	// Automatically kill the bullet sprites when they go out of bounds 
	this.bulletPool.setAll('outOfBoundsKill', true); 
	this.bulletPool.setAll('checkWorldBounds', true); 

	this.nextShotAt = 0; 
	this.shotDelay = BasicGame.SHOT_DELAY ;
}, 

setupExplosions: function () { 
	this.explosionPool = this.add.group(); 
	this.explosionPool.enableBody = true; 
	this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE; 
	this.explosionPool.createMultiple(100, 'explosion'); 
	this.explosionPool.setAll('anchor.x', 0.5); 
	this.explosionPool.setAll('anchor.y', 0.5); 
	this.explosionPool.forEach(function (explosion) { 
		explosion.animations.add('boom'); 
	});
}, 

setupText: function () { 
	this.instructions = this.add.text(       this.game.width / 2,        this.game.height - 100, 
	'Use Arrow Keys to Move, Press Z to Fire\n' +  
	'Tapping/clicking does both',  
	{ font: '20px monospace', fill: '#fff', align: 'center' } 
	); 
	this.instructions.anchor.setTo(0.5, 0.5); 
	this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE; 
  this.score = 0;     
	this.scoreText = this.add.text(       
	this.game.width / 2, 30, '' + this.score,        
	{ font: '20px monospace', fill: '#fff', align: 'center' }     
	);     
	this.scoreText.anchor.setTo(0.5, 0.5); 
  
},

// 
// update()- related functions 
// 
checkCollisions: function () { 
  	this.physics.arcade.overlap( 
  	this.bulletPool, this.enemyPool, this.enemyHit, null, this 
  	); 
    this.physics.arcade.overlap(       
  		this.bulletPool, this.shooterPool, this.enemyHit, null, this     
  	);

  	this.physics.arcade.overlap( 
  	this.player, this.enemyPool, this.playerHit, null, this 
  	); 
    this.physics.arcade.overlap(       
  		this.player, this.shooterPool, this.playerHit, null, this     
  	);      
  	this.physics.arcade.overlap(       
  		this.player, this.enemyBulletPool, this.playerHit, null, this     
  	);
    
    this.physics.arcade.overlap(       
  		this.player, this.powerUpPool, this.playerPowerUp, null, this     
  	);
    
    if (this.bossApproaching === false) {       
	  	this.physics.arcade.overlap(         
	  		this.bulletPool, this.bossPool, this.enemyHit, null, this       
	  	);        
	  	this.physics.arcade.overlap(         
	  		this.player, this.bossPool, this.playerHit, null, this       
	  	);     
        }
}, 

spawnEnemies: function () { 
	if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) { 
		this.nextEnemyAt = this.time.now + this.enemyDelay; 
		var enemy = this.enemyPool.getFirstExists(false); 
		// spawn at a random location top of the screen 
		enemy.reset(         
			this.rnd.integerInRange(20, this.game.width - 20), 0,         
			BasicGame.ENEMY_HEALTH       
		); 
		// also randomize the speed 
		enemy.body.velocity.y = this.rnd.integerInRange(         
	  	BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY    
	  	); 
		enemy.play('fly'); 
	} 
  
  if (this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {       
		this.nextShooterAt = this.time.now + this.shooterDelay;       
		var shooter = this.shooterPool.getFirstExists(false);        
		// spawn at a random location at the top         
		shooter.reset(         this.rnd.integerInRange(20, this.game.width - 20), 0,         BasicGame.SHOOTER_HEALTH       );        
		// choose a random target location at the bottom       
		var target = this.rnd.integerInRange(20, this.game.width - 20);        
		// move to target and rotate the sprite accordingly         
		shooter.rotation = this.physics.arcade.moveToXY(  
			shooter, target, this.game.height,         
			this.rnd.integerInRange( BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY )       
		) - Math.PI / 2;        
		shooter.play('fly');        
		// each shooter has their own shot timer        
		shooter.nextShotAt = 0;     
	}
}, 

	playerPowerUp: function (player, powerUp) { 
  	this.addToScore(powerUp.reward); 
  	powerUp.kill(); 
    this.powerUpSFX.play();
  	if (this.weaponLevel < 5) { 
  		this.weaponLevel++; 
    } 
}, 

processPlayerInput: function () { 
	this.player.body.velocity.x = 0; 
	this.player.body.velocity.y = 0; 

	if (this.cursors.left.isDown) { 
		this.player.body.velocity.x = -this.player.speed; 
	} else if (this.cursors.right.isDown) { 
		this.player.body.velocity.x = this.player.speed; 
	} 

	if (this.cursors.up.isDown) { 
		this.player.body.velocity.y = -this.player.speed; 
	} else if (this.cursors.down.isDown) { 
		this.player.body.velocity.y = this.player.speed; 
	} 

	if (this.input.activePointer.isDown && 
	this.physics.arcade.distanceToPointer(this.player) > 15) { 
		this.physics.arcade.moveToPointer(this.player, this.player.speed); 
	} 

	if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || 
	this.input.activePointer.isDown) { 
		if (this.returnText && this.returnText.exists) {         
		this.quitGame();       
		} else {         
			this.fire();       
		}
	} 
}, 

processDelayedEffects: function () { 
	if (this.instructions.exists && this.time.now > this.instExpire) { 
		this.instructions.destroy(); 
	} 
  if (this.ghostUntil && this.ghostUntil < this.time.now) {       
		this.ghostUntil = null;       
		this.player.play('fly');     
	}
  if (this.showReturn && this.time.now > this.showReturn) {       
		this.returnText = this.add.text(         
			this.game.width / 2, this.game.height / 2 + 20,          
			'Press Z or Tap Game to go back to Main Menu',          
			{ font: '16px sans-serif', fill: '#fff'}       
		);       

		this.returnText.anchor.setTo(0.5, 0.5);       
		this.showReturn = false;     
	}
		
    if (this.bossApproaching && this.boss.y > 80) {       
	        this.bossApproaching = false;       
	        this.boss.nextShotAt = 0;        
	        this.boss.body.velocity.y = 0;       
	        this.boss.body.velocity.x = BasicGame.BOSS_X_VELOCITY;       
	        // allow bouncing off world bounds       
	        this.boss.body.bounce.x = 1;       
	        this.boss.body.collideWorldBounds = true;     
        }
},

enemyHit: function (bullet, enemy) {
  	bullet.kill();
   this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
    
      
    
},
 
 playerHit: function (player, enemy) { 
 // crashing into an enemy only deals 5 damage     
	this.damageEnemy(enemy, BasicGame.CRASH_DAMAGE); 
 var life = this.lives.getFirstAlive();     
	if (life !== null) {       
		life.kill();       
    this.weaponLevel = 0;
		this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;       
		this.player.play('ghost');     
	} else {       
  	this.playerExplosionSFX.play();
		this.explode(player);       
		player.kill();     
    this.displayEnd(false); 
	}
}, 
	
  damageEnemy: function (enemy, damage) { 
	enemy.damage(damage); 
	if (enemy.alive) { 
		enemy.play('hit'); 
	} else { 
		this.explosionSFX.play();
		this.explode(enemy); 
    this.spawnPowerUp(enemy);
    this.addToScore(enemy.reward);
    
    // We check the sprite key (e.g. 'greenEnemy') to see if the sprite is a boss       
	    // For full games, it would be better to set flags on the sprites themselves       
	    if (enemy.key === 'boss') {         
		    this.enemyPool.destroy();         
		    this.shooterPool.destroy();         
		    this.bossPool.destroy();         
		    this.enemyBulletPool.destroy();         
		    this.displayEnd(true);       
	    }
    
	} 
  
}, 

	addToScore: function (score) { 
	this.score += score; 
	this.scoreText.text = this.score; 
  
  // this approach prevents the boss from spawning again upon winning     
        if (this.score >= 20000 && this.bossPool.countDead() == 1) {       
    	    this.spawnBoss();     
	}
}, 

displayEnd: function (win) { 
	// you can't win and lose at the same time 
	if (this.endText && this.endText.exists) { 
		return; 
	} 
	
  this.bossMusic.stop();
	this.music.stop();
	this.gameOverMusic.play();

	var msg = win ? 'You Win!!!' : 'Game Over!'; 
	this.endText = this.add.text(  
	this.game.width / 2, this.game.height / 2 - 60, msg,  
		{ font: '72px serif', fill: '#fff' } 
	); 
	this.endText.anchor.setTo(0.5, 0); 

	this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY; 
},
  
  explode: function (sprite) { 
	if (this.explosionPool.countDead() === 0) { 
		return; 
	} 
	var explosion = this.explosionPool.getFirstExists(false); 
	explosion.reset(sprite.x, sprite.y); 
	explosion.play('boom', 15, false, true); 
	// add the original sprite's velocity to the explosion 
	explosion.body.velocity.x = sprite.body.velocity.x; 
	explosion.body.velocity.y = sprite.body.velocity.y; 
},
	
  spawnPowerUp: function (enemy) { 
  	if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) {  
  		return; 
    } 

    if (this.rnd.frac() < enemy.dropRate) { 
	    var powerUp = this.powerUpPool.getFirstExists(false); 
	    powerUp.reset(enemy.x, enemy.y); 
	    powerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY; 
	} 
},
  
  spawnBoss: function () { 
  	this.bossApproaching = true; 
  	this.boss.reset(this.game.width / 2, 0, BasicGame.BOSS_HEALTH); 
  	this.physics.enable(this.boss, Phaser.Physics.ARCADE); 
  	this.boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY; 
  	this.boss.play('fly'); 
    
    this.music.stop();
	this.bossMusic.play();
},

		setupAudio: function () {
  this.explosionSFX = this.add.audio('explosion', 0.3);
  this.playerExplosionSFX = this.add.audio('playerExplosion', 0.3);
  this.enemyFireSFX = this.add.audio('enemyFire', 0.3);
  this.playerFireSFX = this.add.audio('playerFire', 0.3);
  this.powerUpSFX = this.add.audio('powerUp', 0.3);
  this.music = this.add.audio('stageMusic', 0.5, true);
  this.bossMusic = this.add.audio('bossMusic', 0.5, true);
  this.gameOverMusic = this.add.audio('gameOverMusic');
  this.music.play();
},

  quitGame: function(pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.sea.destroy();     
	this.player.destroy();     
	this.enemyPool.destroy();     
	this.bulletPool.destroy();     
	this.explosionPool.destroy();     
	this.instructions.destroy();     
	this.scoreText.destroy();     
	this.endText.destroy();     
	this.returnText.destroy();
  this.bossMusic.destroy();
	this.music.destroy();
	this.gameOverMusic.destroy();

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};

//app loading
window.onload = function() {

  //  Create your Phaser game and inject it into the gameContainer div.
  //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');

  //  Add the States your game has.
  //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
  game.state.add('Boot', BasicGame.Boot);
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('MainMenu', BasicGame.MainMenu);
  game.state.add('Game', BasicGame.Game);

  //  Now start the Boot state.
  game.state.start('Boot');

};
