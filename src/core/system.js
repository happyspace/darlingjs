'use strict';
/**
 * Project: GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var System = function () {
    this.init();
};

System.prototype.$name = '';

System.prototype.$$updateHandler = noop;

System.prototype.init = function() {
    this.$setNodes(new List());
};

System.prototype.$setNodes = function($nodes) {
    this.$nodes = $nodes;

    var self = this;
    this.$nodes.on('add', function(node) {
        self.$$addNodeHandler(node);
    });

    this.$nodes.on('remove', function(node) {
        self.$$removeNodeHandler(node);
    });
};

System.prototype.$$updateEveryNode = function(handler, context) {
    return function(time) {
        this.$nodes.forEach(handler, context, time);
    };
};