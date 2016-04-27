require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2fdbcVQ0+tFVbvpbDmvXexP', 'game');
// sprite/game.js

cc.Class({
    'extends': cc.Component,

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
        player: {
            'default': null,
            type: cc.Sprite
        },
        starPrefab: {
            'default': null,
            type: cc.Prefab
        },
        ground: {
            'default': null,
            type: cc.Node
        },
        gameover: {
            'default': null,
            type: cc.Layout
        },
        scoresound: {
            'default': null,
            url: cc.AudioClip
        },
        bgmsound: {
            'default': null,
            url: cc.AudioClip
        },
        timelabel: {
            'default': null,
            type: cc.Label
        },
        scorelabel: {
            'default': null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.time = 0;
        this.generateStar();

        this.callback = function () {
            // 这里的 this 指向 component
            this.countTime();
        };
        this.schedule(this.callback, 1);
        cc.audioEngine.playMusic(this.bgmsound, true);
    },

    /**
     * 计时
     */
    countTime: function countTime() {
        this.time += 1;
        this.timelabel.string = 'time:' + this.time;
    },

    /**
     * 展示分数
     */
    showScore: function showScore() {
        this.scorelabel.string = 'score:' + this.time;
        cc.audioEngine.stopMusic(true);
    },

    stopCountTime: function stopCountTime() {
        this.unschedule(this.callback);
    },

    // 生成星星
    generateStar: function generateStar() {
        this.star = cc.instantiate(this.starPrefab);
        this.node.addChild(this.star);

        var width = cc.director.getWinSize().width;
        var newX = cc.randomMinus1To1() * width / 2;

        var maxHeight = this.player.getComponent('player').maxHeight;
        var groundY = this.ground.getPositionY();
        var newY = cc.random0To1() * maxHeight + groundY + 50;

        this.star.getComponent('star').init(this);
        this.star.setPosition(cc.p(newX, newY));
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"player":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5fea59KfI5MqqLFvNebq7vx', 'player');
// sprite/player.js

/**
 * 用到的物理公式
 * V(速度) ＝ v0(当前速度) ＋ a(加速度)＊t(时间)
 * S(位移) ＝ v(速度)＊t(时间)
 */
cc.Class({
    'extends': cc.Component,

    properties: {
        maxHeight: 0,
        speed: 0,
        accle: 0,
        jumpsound: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.accLeft = false;
        this.accRight = false;

        this.initAnim();
        this.setListener();
    },

    /**
     * 初始化动画
     */
    initAnim: function initAnim() {
        var jumpUp = cc.moveBy(0.6, cc.p(this.node.x, this.maxHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(0.6, cc.p(this.node.x, -this.maxHeight)).easing(cc.easeCubicActionIn());

        var short = cc.scaleTo(0.1, 1, 0.6);
        var long = cc.scaleTo(0.1, 1, 1.2);
        var back = cc.scaleTo(0.1, 1, 1);

        var callback = cc.callFunc(this.playJumpSound, this);

        var anim = cc.sequence(callback, short, long, jumpUp, back, jumpDown);
        this.node.runAction(cc.repeatForever(anim));
    },

    /**
     * 播放跳跃音效
     */
    playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpsound, false);
    },

    /**
     * 设置按钮监听事件
     * 主要监听左右按键事件
     */
    setListener: function setListener() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                    default:
                        break;
                }
            },
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = false;
                        self.accRight = false;
                        break;
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = false;
                        break;
                    default:
                        break;
                }
            }
        }, this.node);

        // 设置触摸事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(event) {
                var xLine = self.node.getNodeToWorldTransform().tx;
                cc.log('play x = ' + xLine);
                var eventX = event.getLocation().x;
                cc.log('eventX x = ' + eventX);
                if (eventX > xLine) {
                    cc.log('to right');
                    self.accLeft = false;
                    self.accRight = true;
                } else if (eventX < xLine) {
                    cc.log('to left');
                    self.accLeft = true;
                    self.accRight = false;
                }
            },
            onTouchEnded: function onTouchEnded(event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // 获取屏幕宽度
        var width = cc.director.getWinSize().width;

        // 计算位移
        var newX = this.node.x + this.getSpeed(dt) * dt;

        // 避免超出屏幕
        if (!(newX > width / 2) && !(newX < -width / 2)) {
            this.node.x = newX;
        } else {
            this.speed = 0;
        }
    },

    // 获取速度
    getSpeed: function getSpeed(dt) {
        if (this.accLeft) {
            //计算向左速度
            this.speed -= this.accle * dt;
        } else if (this.accRight) {
            //计算向右速度
            this.speed += this.accle * dt;
        }
        return this.speed;
    },

    // 停止移动
    stopMove: function stopMove() {
        this.node.stopAllActions();
    }
});

cc._RFpop();
},{}],"replay":[function(require,module,exports){
"use strict";
cc._RFpush(module, '27f24b/tN9AF7FWevPA8SFl', 'replay');
// sprite/replay.js

cc.Class({
    "extends": cc.Component,

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

        bgmsound: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.audioEngine.playEffect(this.bgmsound, false);
    },

    /**
     * 触发replay动作
     */
    replay: function replay() {
        cc.log("action to replay");
        cc.audioEngine.stopAllEffects();
        cc.director.loadScene('game');
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"star":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c5dd3FqJfZIo5WyPeznVOh4', 'star');
// sprite/star.js

cc.Class({
    'extends': cc.Component,

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
        radius: 0
    },

    // 传递game对象
    init: function init(game) {
        this.game = game;
    },

    // use this for initialization
    onLoad: function onLoad() {
        var anim = this.getComponent(cc.Animation);
        anim.play('starAnim');
    },

    /**
     * 拾取星星
     */
    pickStar: function pickStar() {
        var dis = cc.pDistance(this.game.player.node.getPosition(), this.node.getPosition());
        if (dis < this.radius) {
            // 播放星星被拾取音效
            cc.audioEngine.playEffect(this.game.getComponent('game').scoresound, false);
            this.removeStar();
            this.game.getComponent('game').generateStar();
        }
    },

    /**
     * 从场景中移除星星
     */
    removeStar: function removeStar() {
        this.node.removeFromParent();
    },

    /**
     * 游戏结束
     */
    gameOver: function gameOver() {
        this.removeStar();
        this.game.getComponent('game').stopCountTime();
        this.game.getComponent('game').showScore();
        this.game.gameover.node.active = true;
        this.game.player.getComponent('player').stopMove();
        this.game.player.enabled = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.pickStar();
    }
});

cc._RFpop();
},{}]},{},["replay","game","player","star"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3Nwcml0ZS9nYW1lLmpzIiwiYXNzZXRzL3Nwcml0ZS9wbGF5ZXIuanMiLCJhc3NldHMvc3ByaXRlL3JlcGxheS5qcyIsImFzc2V0cy9zcHJpdGUvc3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmZkYmNWUTArdEZWYnZwYkRtdlhleFAnLCAnZ2FtZScpO1xuLy8gc3ByaXRlL2dhbWUuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgc3RhclByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBnYW1lb3Zlcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XG4gICAgICAgIH0sXG4gICAgICAgIHNjb3Jlc291bmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGJnbXNvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICB0aW1lbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIHNjb3JlbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMudGltZSA9IDA7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVTdGFyKCk7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIOi/memHjOeahCB0aGlzIOaMh+WQkSBjb21wb25lbnRcbiAgICAgICAgICAgIHRoaXMuY291bnRUaW1lKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5jYWxsYmFjaywgMSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh0aGlzLmJnbXNvdW5kLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6h5pe2XG4gICAgICovXG4gICAgY291bnRUaW1lOiBmdW5jdGlvbiBjb3VudFRpbWUoKSB7XG4gICAgICAgIHRoaXMudGltZSArPSAxO1xuICAgICAgICB0aGlzLnRpbWVsYWJlbC5zdHJpbmcgPSAndGltZTonICsgdGhpcy50aW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrliIbmlbBcbiAgICAgKi9cbiAgICBzaG93U2NvcmU6IGZ1bmN0aW9uIHNob3dTY29yZSgpIHtcbiAgICAgICAgdGhpcy5zY29yZWxhYmVsLnN0cmluZyA9ICdzY29yZTonICsgdGhpcy50aW1lO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wTXVzaWModHJ1ZSk7XG4gICAgfSxcblxuICAgIHN0b3BDb3VudFRpbWU6IGZ1bmN0aW9uIHN0b3BDb3VudFRpbWUoKSB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLy8g55Sf5oiQ5pif5pifXG4gICAgZ2VuZXJhdGVTdGFyOiBmdW5jdGlvbiBnZW5lcmF0ZVN0YXIoKSB7XG4gICAgICAgIHRoaXMuc3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RhclByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLnN0YXIpO1xuXG4gICAgICAgIHZhciB3aWR0aCA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS53aWR0aDtcbiAgICAgICAgdmFyIG5ld1ggPSBjYy5yYW5kb21NaW51czFUbzEoKSAqIHdpZHRoIC8gMjtcblxuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdwbGF5ZXInKS5tYXhIZWlnaHQ7XG4gICAgICAgIHZhciBncm91bmRZID0gdGhpcy5ncm91bmQuZ2V0UG9zaXRpb25ZKCk7XG4gICAgICAgIHZhciBuZXdZID0gY2MucmFuZG9tMFRvMSgpICogbWF4SGVpZ2h0ICsgZ3JvdW5kWSArIDUwO1xuXG4gICAgICAgIHRoaXMuc3Rhci5nZXRDb21wb25lbnQoJ3N0YXInKS5pbml0KHRoaXMpO1xuICAgICAgICB0aGlzLnN0YXIuc2V0UG9zaXRpb24oY2MucChuZXdYLCBuZXdZKSk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNWZlYTU5S2ZJNU1xcUxGdk5lYnE3dngnLCAncGxheWVyJyk7XG4vLyBzcHJpdGUvcGxheWVyLmpzXG5cbi8qKlxuICog55So5Yiw55qE54mp55CG5YWs5byPXG4gKiBWKOmAn+W6pikg77ydIHYwKOW9k+WJjemAn+W6pikg77yLIGEo5Yqg6YCf5bqmKe+8inQo5pe26Ze0KVxuICogUyjkvY3np7spIO+8nSB2KOmAn+W6pinvvIp0KOaXtumXtClcbiAqL1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBtYXhIZWlnaHQ6IDAsXG4gICAgICAgIHNwZWVkOiAwLFxuICAgICAgICBhY2NsZTogMCxcbiAgICAgICAganVtcHNvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2NSaWdodCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaW5pdEFuaW0oKTtcbiAgICAgICAgdGhpcy5zZXRMaXN0ZW5lcigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDliJ3lp4vljJbliqjnlLtcbiAgICAgKi9cbiAgICBpbml0QW5pbTogZnVuY3Rpb24gaW5pdEFuaW0oKSB7XG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy5tb3ZlQnkoMC42LCBjYy5wKHRoaXMubm9kZS54LCB0aGlzLm1heEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIHZhciBqdW1wRG93biA9IGNjLm1vdmVCeSgwLjYsIGNjLnAodGhpcy5ub2RlLngsIC10aGlzLm1heEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblxuICAgICAgICB2YXIgc2hvcnQgPSBjYy5zY2FsZVRvKDAuMSwgMSwgMC42KTtcbiAgICAgICAgdmFyIGxvbmcgPSBjYy5zY2FsZVRvKDAuMSwgMSwgMS4yKTtcbiAgICAgICAgdmFyIGJhY2sgPSBjYy5zY2FsZVRvKDAuMSwgMSwgMSk7XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5SnVtcFNvdW5kLCB0aGlzKTtcblxuICAgICAgICB2YXIgYW5pbSA9IGNjLnNlcXVlbmNlKGNhbGxiYWNrLCBzaG9ydCwgbG9uZywganVtcFVwLCBiYWNrLCBqdW1wRG93bik7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihhbmltKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaSreaUvui3s+i3g+mfs+aViFxuICAgICAqL1xuICAgIHBsYXlKdW1wU291bmQ6IGZ1bmN0aW9uIHBsYXlKdW1wU291bmQoKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5qdW1wc291bmQsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6+572u5oyJ6ZKu55uR5ZCs5LqL5Lu2XG4gICAgICog5Li76KaB55uR5ZCs5bem5Y+z5oyJ6ZSu5LqL5Lu2XG4gICAgICovXG4gICAgc2V0TGlzdGVuZXI6IGZ1bmN0aW9uIHNldExpc3RlbmVyKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcblxuICAgICAgICAvLyDorr7nva7op6bmkbjkuovku7ZcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXG4gICAgICAgICAgICBvblRvdWNoQmVnYW46IGZ1bmN0aW9uIG9uVG91Y2hCZWdhbihldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciB4TGluZSA9IHNlbGYubm9kZS5nZXROb2RlVG9Xb3JsZFRyYW5zZm9ybSgpLnR4O1xuICAgICAgICAgICAgICAgIGNjLmxvZygncGxheSB4ID0gJyArIHhMaW5lKTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRYID0gZXZlbnQuZ2V0TG9jYXRpb24oKS54O1xuICAgICAgICAgICAgICAgIGNjLmxvZygnZXZlbnRYIHggPSAnICsgZXZlbnRYKTtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRYID4geExpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKCd0byByaWdodCcpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudFggPCB4TGluZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ3RvIGxlZnQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblRvdWNoRW5kZWQ6IGZ1bmN0aW9uIG9uVG91Y2hFbmRlZChldmVudCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvLyDojrflj5blsY/luZXlrr3luqZcbiAgICAgICAgdmFyIHdpZHRoID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLndpZHRoO1xuXG4gICAgICAgIC8vIOiuoeeul+S9jeenu1xuICAgICAgICB2YXIgbmV3WCA9IHRoaXMubm9kZS54ICsgdGhpcy5nZXRTcGVlZChkdCkgKiBkdDtcblxuICAgICAgICAvLyDpgb/lhY3otoXlh7rlsY/luZVcbiAgICAgICAgaWYgKCEobmV3WCA+IHdpZHRoIC8gMikgJiYgIShuZXdYIDwgLXdpZHRoIC8gMikpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gbmV3WDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOiOt+WPlumAn+W6plxuICAgIGdldFNwZWVkOiBmdW5jdGlvbiBnZXRTcGVlZChkdCkge1xuICAgICAgICBpZiAodGhpcy5hY2NMZWZ0KSB7XG4gICAgICAgICAgICAvL+iuoeeul+WQkeW3pumAn+W6plxuICAgICAgICAgICAgdGhpcy5zcGVlZCAtPSB0aGlzLmFjY2xlICogZHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hY2NSaWdodCkge1xuICAgICAgICAgICAgLy/orqHnrpflkJHlj7PpgJ/luqZcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgKz0gdGhpcy5hY2NsZSAqIGR0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNwZWVkO1xuICAgIH0sXG5cbiAgICAvLyDlgZzmraLnp7vliqhcbiAgICBzdG9wTW92ZTogZnVuY3Rpb24gc3RvcE1vdmUoKSB7XG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMjdmMjRiL3ROOUFGN0ZXZXZQQThTRmwnLCAncmVwbGF5Jyk7XG4vLyBzcHJpdGUvcmVwbGF5LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBiZ21zb3VuZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYmdtc291bmQsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6Kem5Y+RcmVwbGF55Yqo5L2cXG4gICAgICovXG4gICAgcmVwbGF5OiBmdW5jdGlvbiByZXBsYXkoKSB7XG4gICAgICAgIGNjLmxvZyhcImFjdGlvbiB0byByZXBsYXlcIik7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGxFZmZlY3RzKCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M1ZGQzRnFKZlpJbzVXeVBlem5WT2g0JywgJ3N0YXInKTtcbi8vIHNwcml0ZS9zdGFyLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJhZGl1czogMFxuICAgIH0sXG5cbiAgICAvLyDkvKDpgJJnYW1l5a+56LGhXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgYW5pbSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGFuaW0ucGxheSgnc3RhckFuaW0nKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5ou+5Y+W5pif5pifXG4gICAgICovXG4gICAgcGlja1N0YXI6IGZ1bmN0aW9uIHBpY2tTdGFyKCkge1xuICAgICAgICB2YXIgZGlzID0gY2MucERpc3RhbmNlKHRoaXMuZ2FtZS5wbGF5ZXIubm9kZS5nZXRQb3NpdGlvbigpLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKSk7XG4gICAgICAgIGlmIChkaXMgPCB0aGlzLnJhZGl1cykge1xuICAgICAgICAgICAgLy8g5pKt5pS+5pif5pif6KKr5ou+5Y+W6Z+z5pWIXG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ2dhbWUnKS5zY29yZXNvdW5kLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0YXIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ2dhbWUnKS5nZW5lcmF0ZVN0YXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDku47lnLrmma/kuK3np7vpmaTmmJ/mmJ9cbiAgICAgKi9cbiAgICByZW1vdmVTdGFyOiBmdW5jdGlvbiByZW1vdmVTdGFyKCkge1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmuLjmiI/nu5PmnZ9cbiAgICAgKi9cbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlU3RhcigpO1xuICAgICAgICB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdnYW1lJykuc3RvcENvdW50VGltZSgpO1xuICAgICAgICB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdnYW1lJykuc2hvd1Njb3JlKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5nYW1lb3Zlci5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdwbGF5ZXInKS5zdG9wTW92ZSgpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVyLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLnBpY2tTdGFyKCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
