var MenuState = function(){
};

MenuState.prototype = {
    preload:function(){
        this.load.image("logo", "res/logo.png");
    },
    
    create:function(){
        this.logo = this.add.sprite(0, 0, "logo");
    },
    
    update:function(){
    }
};