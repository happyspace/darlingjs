'use strict';
/**
 * Project: GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

describe('system', function() {
    var defaultModule,
        defaultWorld;
    beforeEach(function() {
        defaultModule = GameEngine.module('defaultModule', {})
            .system('defaultSystem');
        defaultWorld = GameEngine.world('defaultWorld', ['defaultModule']);
    });

    afterEach(function() {
        GameEngine.removeAllModules();
        GameEngine.removeAllWorlds();
    });

    it('should be added to the module', function() {
        var m = GameEngine.module('theModule', {})
            .system('theSystem');

        expect(m.has('theSystem')).toBe(true);
    });

    it('should be added to the world', function() {
        GameEngine.module('testModule', {})
            .system('testSystem');

        var world = GameEngine.world('testWorld', ['testModule']);
        world.add('testSystem');
        expect(world.isUse('testSystem')).toBe(true);
    });

    it('should has no any nodes by default', function() {
        var system = defaultWorld.add('defaultSystem');
        expect(system.$nodes.length()).toBe(0);
    });

    it(' after been added to world should fetch required nodes from world', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.e('theEntity', ['theComponent']);
        world.add(entity);
        var system = world.add('testSystem');
        expect(system.$nodes.length()).toBe(1);
        system.$nodes.forEach(function(e) {
            expect(e).toBe(entity);
        });
    });

    it('should fetch entity to $nodes after entity been added', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.e('theEntity', ['theComponent']);
        var system = world.add('testSystem');
        world.add(entity);
        expect(system.$nodes.length()).toBe(1);
        system.$nodes.forEach(function(e) {
            expect(e).toBe(entity);
        });
    });

    it('should remove entity from $nodes after entity been removed', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.e('theEntity', ['theComponent']);
        var system = world.add('testSystem');
        world.add(entity);
        world.remove(entity);
        expect(system.$nodes.length()).toBe(0);
    });

    it('should fetch entity to $nodes after required component been added to entity', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.e('theEntity');
        var system = world.add('testSystem');
        world.add(entity);
        entity.$add('theComponent');

        expect(system.$nodes.length()).toBe(1);
        system.$nodes.forEach(function(e) {
            expect(e).toBe(entity);
        });
    });

    it('should remove entity from $nodes after required component been removed from entity', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.e('theEntity', ['theComponent']);
        var system = world.add('testSystem');
        world.add(entity);
        entity.$remove('theComponent');
        expect(system.$nodes.length()).toBe(0);
    });

    it('should inject dependency in $init', function() {
        //TODO : Write test: System should inject dependency in $init.
    });

    it('should inject dependency in $update.', function() {

    });

    it('should run once for $nodes and many for $node request.', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent'],
                $update: [function() {

                }]
            });
    });

    it('should execute update handler on update.', function() {
        var updateHandler = sinon.spy();
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent'],
                $update: updateHandler
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        world.add('testSystem');
        world.$update();
        expect(updateHandler.calledOnce).toBeTruthy();
    });

    /*

    it('should match entity by component in system requirement', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                require: ['theComponent']
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var entity = world.e('theEntity', ['theComponent']);
        world.add(entity);
        var system = world.add('testSystem');
        expect(system.numNodes()).toBe(1);
        expect(system.getNodeByIndex(0)).toBe(entity);
    });


     it('should match entity by component in system requirement', function() {
     GameEngine.module('testModule')
     .c('theComponent')
     .system('testSystem', {
     require: ['theComponent'],
     update: function($node) {

     }
     });

     var world = GameEngine.world('testWorld', ['testModule']);
     var entity = world.e('theEntity', ['theComponent']);
     var system = world.add('testSystem');
     expect(system.numNodes()).toBe(1);
     expect(system.getNodeByIndex(0)).toBe(entity);
     });
    it('should get all nodes on update', function() {
        GameEngine.module('testModule')
            .system('testSystem', {
                require: [],
                update: function($nodes) {

                }
            });
        var world = GameEngine.world('testWorld', ['testModule']);
        world.add('testSystem');
    });
    */
    //TODO
    //update($node) update($time) update($world)
    //addNode, removeNode
})