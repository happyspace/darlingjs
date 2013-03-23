/*jslint node: true */
'use strict';

/**
 * Project: GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

describe('World', function() {
    var world;
    var module;

    beforeEach(function() {
        module = GameEngine.module('testModule1')
            .c('testComponent1', {
                x: 12,
                y: 34
            })
            .c('testComponent2', {
                name: 'hello'
            })
            .c('testComponent3', {
                world: 'new brave'
            });

        world = GameEngine.world('world', ['testModule1']);
    });

    afterEach(function() {
        GameEngine.removeAllModules();
        GameEngine.removeAllWorlds();
    });

    it('should create entity by world.entity() and world.e()', function() {
        var e = world.$entity();
        expect(e).toBeDefined();

        e = world.$e();
        expect(e).toBeDefined();
    });

    it('should create entity with name', function() {
        var e = world.$entity('name');
        expect(e.name).toEqual('name');
    });

    it('should hasn\'t wrong component and modules', function() {
        expect(world.$has('wrong component')).not.toEqual(true);
        expect(world.$has('wrong module')).not.toEqual(true);
    })

    it('should load requested module', function() {
        expect(world.$has('testModule1')).toEqual(true);
    });

    it('should load component from requested module', function() {
        expect(world.$has('testComponent1')).toEqual(true);
    });

    it('should create entity with component with default state', function() {
        var e = world.$entity('name', ['testComponent1']);

        expect(e.testComponent1).toBeDefined();
        expect(e.testComponent1.x).toEqual(12);
        expect(e.testComponent1.y).toEqual(34);
    });

    it('should can\' override defulat state of entity', function() {
        var e = world.$entity('name', [
            'testComponent1', {x: 0, y: 1, z: 2}
        ]);

        expect(e.testComponent1).toBeDefined();
        expect(e.testComponent1.x).toEqual(0);
        expect(e.testComponent1.y).toEqual(1);
        expect(e.testComponent1.z).toEqual(2);
    });

    it('after added entity should return proper count', function() {
        var e1 = world.$entity('entity1', ['testComponent1']);
        var e2 = world.$entity('entity2', ['testComponent2']);
        var e3 = world.$entity('entity3', ['testComponent2']);
        world.$add(e1);
        world.$add(e2);
        world.$add(e3);
        expect(world.$numEntities()).toBe(3);
        var elements = [];
        world.$entities.forEach(function(e) {
            elements.push(e);
        });
        expect(elements[0]).toBe(e1);
        expect(elements[1]).toBe(e2);
        expect(elements[2]).toBe(e3);
        expect(elements.length).toBe(3);
    });

    it('after added and removed entity should return proper count', function() {
        var e1 = world.$entity('entity1', ['testComponent1']);
        var e2 = world.$entity('entity2', ['testComponent2']);
        var e3 = world.$entity('entity3', ['testComponent2']);
        world.$add(e1);
        world.$add(e2);
        world.$add(e3);

        world.$remove(e3);
        world.$remove(e2);
        world.$remove(e1);
        expect(world.$numEntities()).toBe(0);
    });

    it('should return by one component', function() {
        var e1 = world.$entity('entity1', ['testComponent1']);
        var e2 = world.$entity('entity2', ['testComponent2']);
        var e3 = world.$entity('entity3', ['testComponent3']);
        world.$add(e1);
        world.$add(e2);
        world.$add(e3);

        var e1List = world.$queryByComponents('testComponent1');
        expect(e1List.length()).toBe(1);
        e1List.forEach(function(e) {
            expect(e).toBe(e1);
        });
        var e2List = world.$queryByComponents('testComponent2');
        expect(e2List.length()).toBe(1);
        e2List.forEach(function(e) {
            expect(e).toBe(e2);
        });
        var e3List = world.$queryByComponents('testComponent3');
        expect(e3List.length()).toBe(1);
        e3List.forEach(function(e) {
            expect(e).toBe(e3);
        });
    });

    it('should return by two components', function() {
        var e1 = world.$entity('entity1', ['testComponent1']);
        var e2 = world.$entity('entity2', ['testComponent1', 'testComponent2']);
        var e3 = world.$entity('entity3', ['testComponent1', 'testComponent2', 'testComponent3']);
        world.$add(e1);
        world.$add(e2);
        world.$add(e3);

        var e1List = world.$queryByComponents(['testComponent1', 'testComponent2']);
        expect(e1List.length()).toBe(2);
        var elements = [];
        e1List.forEach(function(e) {
            elements.push(e);
        });
    });

    it('should build component with default state', function() {
        var c = world.$component('testComponent1');
        expect(c).toBeDefined();
        expect(c.x).toBe(12);
        expect(c.y).toBe(34);
    });

    it('should build component and override default state', function() {
        var c = world.$component('testComponent1', {
            x:15
        });
        expect(c).toBeDefined();
        expect(c.x).toBe(15);
        expect(c.y).toBe(34);
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
        world.$add('testSystem');
        world.$update(11);
        expect(updateHandler.calledOnce).toBeTruthy();
        expect(updateHandler.calledWith(11)).toBeTruthy();
    });

    it('should instantiate by name without add it', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem', {
                x: 10,
                y: 20
            });

        var world = GameEngine.world('testWorld', ['testModule']);
        var system = world.$system('testSystem', {
            z: 30
        });

        expect(system).toBeDefined();
        expect(system.x).toBe(10);
        expect(system.y).toBe(20);
        expect(system.z).toBe(30);
        expect(world.$isUse(system)).toBeFalsy();
    });

    it('should added my instance', function() {
        GameEngine.module('testModule')
            .c('theComponent')
            .system('testSystem');

        var world = GameEngine.world('testWorld', ['testModule']);
        var systemInstance = world.$system('testSystem');
        world.$add(systemInstance);

        expect(world.$isUse(systemInstance)).toBeTruthy();
    });
});