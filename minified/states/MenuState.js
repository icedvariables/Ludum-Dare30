var MenuState=function(){};
MenuState.prototype={preload:function(){this.load.image("logo","res/textures/logo.png")},create:function(){this.logo=this.add.sprite(0,0,"logo");this.t=game.time.now;this.playText=this.add.text(WIDTH/2-100,HEIGHT/2+100,"Press space to play...",{font:"20px Arial",fill:"#ff0044",align:"center"});this.input.keyboard.onDownCallback=this.keyPress;this.spaceKey=this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR,!0)},update:function(){game.time.now>this.t&&(this.playText.visible=!this.playText.visible,
this.t=game.time.now+500);this.spaceKey.isDown&&this.playGame()},playGame:function(){console.log("play");game.state.start("main game")}};