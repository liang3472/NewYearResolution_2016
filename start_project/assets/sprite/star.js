cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        radius: 0,
    },

    init: function(game){
        this.game = game;
    },

    // use this for initialization
    onLoad: function () {
        var anim = this.getComponent(cc.Animation);
        anim.play('starAnim');
    },
    
    pickStar: function(){
        var dis = cc.pDistance(this.game.player.node.getPosition(), this.node.getPosition())
        if(dis < this.radius){
            this.removeStar();
            this.game.getComponent('game').generateStar();
        }
    },
    
    removeStar: function(){
        this.node.removeFromParent();
    },
    
    gameOver: function(){
        this.removeStar();
        this.game.gameover.node.active = true;
        this.game.player.getComponent('player').stopMove();
        this.game.player.enabled = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.pickStar();
    },
});
