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
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.generateStar();
    },

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
        accle: 0
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

        var anim = cc.sequence(short, long, jumpUp, back, jumpDown);
        this.node.runAction(cc.repeatForever(anim));
    },

    /**
     * 设置监听事件
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
        game: {
            "default": null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    replay: function replay() {
        cc.log("action to replay");
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

    init: function init(game) {
        this.game = game;
    },

    // use this for initialization
    onLoad: function onLoad() {
        var anim = this.getComponent(cc.Animation);
        anim.play('starAnim');
    },

    pickStar: function pickStar() {
        var dis = cc.pDistance(this.game.player.node.getPosition(), this.node.getPosition());
        if (dis < this.radius) {
            this.removeStar();
            this.game.getComponent('game').generateStar();
        }
    },

    removeStar: function removeStar() {
        this.node.removeFromParent();
    },

    gameOver: function gameOver() {
        this.removeStar();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3Nwcml0ZS9nYW1lLmpzIiwiYXNzZXRzL3Nwcml0ZS9wbGF5ZXIuanMiLCJhc3NldHMvc3ByaXRlL3JlcGxheS5qcyIsImFzc2V0cy9zcHJpdGUvc3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmZkYmNWUTArdEZWYnZwYkRtdlhleFAnLCAnZ2FtZScpO1xuLy8gc3ByaXRlL2dhbWUuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgc3RhclByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBnYW1lb3Zlcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGF5b3V0XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVTdGFyKCk7XG4gICAgfSxcblxuICAgIGdlbmVyYXRlU3RhcjogZnVuY3Rpb24gZ2VuZXJhdGVTdGFyKCkge1xuICAgICAgICB0aGlzLnN0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5zdGFyKTtcblxuICAgICAgICB2YXIgd2lkdGggPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkud2lkdGg7XG4gICAgICAgIHZhciBuZXdYID0gY2MucmFuZG9tTWludXMxVG8xKCkgKiB3aWR0aCAvIDI7XG5cbiAgICAgICAgdmFyIG1heEhlaWdodCA9IHRoaXMucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykubWF4SGVpZ2h0O1xuICAgICAgICB2YXIgZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLmdldFBvc2l0aW9uWSgpO1xuICAgICAgICB2YXIgbmV3WSA9IGNjLnJhbmRvbTBUbzEoKSAqIG1heEhlaWdodCArIGdyb3VuZFkgKyA1MDtcblxuICAgICAgICB0aGlzLnN0YXIuZ2V0Q29tcG9uZW50KCdzdGFyJykuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdGFyLnNldFBvc2l0aW9uKGNjLnAobmV3WCwgbmV3WSkpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzVmZWE1OUtmSTVNcXFMRnZOZWJxN3Z4JywgJ3BsYXllcicpO1xuLy8gc3ByaXRlL3BsYXllci5qc1xuXG4vKipcbiAqIOeUqOWIsOeahOeJqeeQhuWFrOW8j1xuICogVijpgJ/luqYpIO+8nSB2MCjlvZPliY3pgJ/luqYpIO+8iyBhKOWKoOmAn+W6pinvvIp0KOaXtumXtClcbiAqIFMo5L2N56e7KSDvvJ0gdijpgJ/luqYp77yKdCjml7bpl7QpXG4gKi9cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbWF4SGVpZ2h0OiAwLFxuICAgICAgICBzcGVlZDogMCxcbiAgICAgICAgYWNjbGU6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5pbml0QW5pbSgpO1xuICAgICAgICB0aGlzLnNldExpc3RlbmVyKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWIneWni+WMluWKqOeUu1xuICAgICAqL1xuICAgIGluaXRBbmltOiBmdW5jdGlvbiBpbml0QW5pbSgpIHtcbiAgICAgICAgdmFyIGp1bXBVcCA9IGNjLm1vdmVCeSgwLjYsIGNjLnAodGhpcy5ub2RlLngsIHRoaXMubWF4SGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcbiAgICAgICAgdmFyIGp1bXBEb3duID0gY2MubW92ZUJ5KDAuNiwgY2MucCh0aGlzLm5vZGUueCwgLXRoaXMubWF4SGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuXG4gICAgICAgIHZhciBzaG9ydCA9IGNjLnNjYWxlVG8oMC4xLCAxLCAwLjYpO1xuICAgICAgICB2YXIgbG9uZyA9IGNjLnNjYWxlVG8oMC4xLCAxLCAxLjIpO1xuICAgICAgICB2YXIgYmFjayA9IGNjLnNjYWxlVG8oMC4xLCAxLCAxKTtcblxuICAgICAgICB2YXIgYW5pbSA9IGNjLnNlcXVlbmNlKHNob3J0LCBsb25nLCBqdW1wVXAsIGJhY2ssIGp1bXBEb3duKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5yZXBlYXRGb3JldmVyKGFuaW0pKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6+572u55uR5ZCs5LqL5Lu2XG4gICAgICog5Li76KaB55uR5ZCs5bem5Y+z5oyJ6ZSu5LqL5Lu2XG4gICAgICovXG4gICAgc2V0TGlzdGVuZXI6IGZ1bmN0aW9uIHNldExpc3RlbmVyKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcblxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHhMaW5lID0gc2VsZi5ub2RlLmdldE5vZGVUb1dvcmxkVHJhbnNmb3JtKCkudHg7XG4gICAgICAgICAgICAgICAgY2MubG9nKCdwbGF5IHggPSAnICsgeExpbmUpO1xuICAgICAgICAgICAgICAgIHZhciBldmVudFggPSBldmVudC5nZXRMb2NhdGlvbigpLng7XG4gICAgICAgICAgICAgICAgY2MubG9nKCdldmVudFggeCA9ICcgKyBldmVudFgpO1xuICAgICAgICAgICAgICAgIGlmIChldmVudFggPiB4TGluZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ3RvIHJpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50WCA8IHhMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygndG8gbGVmdCcpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVG91Y2hFbmRlZDogZnVuY3Rpb24gb25Ub3VjaEVuZGVkKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vIOiOt+WPluWxj+W5leWuveW6plxuICAgICAgICB2YXIgd2lkdGggPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkud2lkdGg7XG5cbiAgICAgICAgLy8g6K6h566X5L2N56e7XG4gICAgICAgIHZhciBuZXdYID0gdGhpcy5ub2RlLnggKyB0aGlzLmdldFNwZWVkKGR0KSAqIGR0O1xuXG4gICAgICAgIC8vIOmBv+WFjei2heWHuuWxj+W5lVxuICAgICAgICBpZiAoIShuZXdYID4gd2lkdGggLyAyKSAmJiAhKG5ld1ggPCAtd2lkdGggLyAyKSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBuZXdYO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g6I635Y+W6YCf5bqmXG4gICAgZ2V0U3BlZWQ6IGZ1bmN0aW9uIGdldFNwZWVkKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmFjY0xlZnQpIHtcbiAgICAgICAgICAgIC8v6K6h566X5ZCR5bem6YCf5bqmXG4gICAgICAgICAgICB0aGlzLnNwZWVkIC09IHRoaXMuYWNjbGUgKiBkdDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFjY1JpZ2h0KSB7XG4gICAgICAgICAgICAvL+iuoeeul+WQkeWPs+mAn+W6plxuICAgICAgICAgICAgdGhpcy5zcGVlZCArPSB0aGlzLmFjY2xlICogZHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3BlZWQ7XG4gICAgfSxcblxuICAgIHN0b3BNb3ZlOiBmdW5jdGlvbiBzdG9wTW92ZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyN2YyNGIvdE45QUY3RldldlBBOFNGbCcsICdyZXBsYXknKTtcbi8vIHNwcml0ZS9yZXBsYXkuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBnYW1lOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgcmVwbGF5OiBmdW5jdGlvbiByZXBsYXkoKSB7XG4gICAgICAgIGNjLmxvZyhcImFjdGlvbiB0byByZXBsYXlcIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M1ZGQzRnFKZlpJbzVXeVBlem5WT2g0JywgJ3N0YXInKTtcbi8vIHNwcml0ZS9zdGFyLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJhZGl1czogMFxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBhbmltID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgYW5pbS5wbGF5KCdzdGFyQW5pbScpO1xuICAgIH0sXG5cbiAgICBwaWNrU3RhcjogZnVuY3Rpb24gcGlja1N0YXIoKSB7XG4gICAgICAgIHZhciBkaXMgPSBjYy5wRGlzdGFuY2UodGhpcy5nYW1lLnBsYXllci5ub2RlLmdldFBvc2l0aW9uKCksIHRoaXMubm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgaWYgKGRpcyA8IHRoaXMucmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0YXIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ2dhbWUnKS5nZW5lcmF0ZVN0YXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVTdGFyOiBmdW5jdGlvbiByZW1vdmVTdGFyKCkge1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgIH0sXG5cbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlU3RhcigpO1xuICAgICAgICB0aGlzLmdhbWUuZ2FtZW92ZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykuc3RvcE1vdmUoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllci5lbmFibGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5waWNrU3RhcigpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
