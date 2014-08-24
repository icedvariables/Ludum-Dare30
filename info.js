// Contains infomation such as the player's health and total monsters killed

var Info = function(){
}

Info.prototype = {
    reset:function(){
        this.totalMonsters = 0;
        this.aliveMonsters = 0;
        this.monstersKilled = 0;
        this.health = 100;
        this.maxAmmo = 20;
        this.ammo = this.maxAmmo;
        
        this.offsetFromBottom = 35;
    },

    createText:function(g){
        var style = {font:"20px Arial", fill:"#ffffff", align:"center"};
        this.totalMonstersText = g.add.text(240, HEIGHT - this.offsetFromBottom, this.totalMonsters, style);
        this.totalMonstersText.fixedToCamera = true;
        this.aliveMonstersText = g.add.text(415, HEIGHT - this.offsetFromBottom, this.aliveMonsters, style);
        this.aliveMonstersText.fixedToCamera = true;
        this.monstersKilledText = g.add.text(600, HEIGHT - this.offsetFromBottom, this.monstersKilled, style);
        this.monstersKilledText.fixedToCamera = true;
        this.healthText = g.add.text(725, HEIGHT - this.offsetFromBottom, this.health, style);
        this.healthText.fixedToCamera = true;
        this.ammoText = g.add.text(75, HEIGHT - this.offsetFromBottom, this.ammo, style);
        this.ammoText.fixedToCamera = true;
    },
    
    updateText:function(){
        this.totalMonstersText.text = this.totalMonsters.toString();
        this.aliveMonstersText.text = this.aliveMonsters.toString();
        this.monstersKilledText.text = this.monstersKilled.toString();
        this.healthText.text = this.health.toString();
        this.ammoText.text = this.ammo.toString();
    }
}