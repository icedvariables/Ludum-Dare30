var GameState = function(){
};

GameState.prototype = {
    preload:function(){
        this.load.image("sprite", "res/banana.png");
    },
    
    create:function(){
        this.sprite = this.add.sprite(0, 0, "sprite");
    },
    
    update:function(){
    
    }
};