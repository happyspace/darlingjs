'use strict';
/**
 * Project: GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var m = darlingjs.module('ngPixijsIntegration');

m.$s('ngPixijsStage', {
    width: 640,
    height: 480,

    targetId: '',

    $require: ['ng2D', 'ngSprite'],

    $added: function() {
        // create an new instance of a pixi stage
        this._stage = new PIXI.Stage(0x66FF99);

        // create a renderer instance.
        var width, height;
        var view;
        if (this.targetId !== null && this.targetId !== '') {
            view = placeCanvasInStack(this.targetId);
            width = view.width;
            height = view.height;
        } else {
            width = this.width;
            height = this.height;
        }

        this._renderer = PIXI.autoDetectRenderer(width, height, view);

        // add the renderer view element to the DOM
        if (!darlingutil.isDefined(view)) {
            document.body.appendChild(this._renderer.view);
        }
    },

    $removed: function() {
        document.removeChild(this._renderer.view);
    },

    $addNode: function($node) {
        var ngSprite = $node.ngSprite;

        // create a texture from an image path
        ngSprite._texture = PIXI.Texture.fromImage(ngSprite.name);

        // create a new Sprite using the texture
        var sprite = ngSprite._sprite = new PIXI.Sprite(ngSprite._texture);

        // center the sprites anchor point
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        var ng2DSize = $node.ng2DSize;
        if(ng2DSize && ngSprite.fitToSize) {
            ngSprite._texture.addEventListener( 'update', function() {
                sprite.width = ng2DSize.width;
                sprite.height = ng2DSize.height;
            });
            //sprite.scale.x = 0.5;
            //sprite.scale.y = 0.5;
        }

        this._stage.addChild(sprite);
    },

    $updateNode: function($node) {
        var sprite = $node.ngSprite;

        var ng2D = $node.ng2D;
        sprite._sprite.position.x = ng2D.x;
        sprite._sprite.position.y = ng2D.y;

        var ng2DRotation = $node.ng2DRotation;
        if (ng2DRotation) {
            sprite._sprite.rotation = ng2DRotation.rotation;
        }
    },

    $update: ['$nodes', function($nodes) {
        $nodes.forEach(this.$updateNode);
        // render the stage
        this._renderer.render(this._stage);
    }]
});