Physijs.scripts.worker = '../libs/physijs_worker.js';
Physijs.scripts.ammo = '../libs/ammo.js';

import {Scene} from './scene.js';
import {Utils} from './utils.js';

const physijsScene = {
    vars: {
        loader: new THREE.TextureLoader(),
        physicsScene: new Physijs.Scene,
        ground_material: null,
        ground: null,
        light: null,
        obstacles: [],
    },
    initScene : function() {
        let vars = physijsScene.vars;

        vars.physicsScene.setGravity(new THREE.Vector3( 0, -100, 0 ));
        vars.physicsScene.addEventListener(
            'update',
            function() {
                vars.physicsScene.simulate(undefined, 1);
            }
        );

        physijsScene.spawnPlayer(new THREE.Vector3( 0, 15, 500), new THREE.Vector3( 0, 0, 0));
        // name, position, dimensions, rotation, color
        physijsScene.spawnObstacle('spawnPlatform', new THREE.Vector3( 0, 0, 500), new THREE.Vector3( 70, 10, 70), new THREE.Vector3( 0, 0, 0), "rgb(255, 0, 0)", physijsScene.handleCollision);
        physijsScene.spawnObstacle('obstacle01', new THREE.Vector3( 100, 45, 400), new THREE.Vector3( 60, 10, 60), new THREE.Vector3( 0, 0, 0), "rgb(75, 0, 130)", physijsScene.handleCollision);
        physijsScene.spawnObstacle('obstacle02', new THREE.Vector3( 0, 100, 300), new THREE.Vector3( 50, 10, 50), new THREE.Vector3( 0, 0, 0), "rgb(0, 0, 255)", physijsScene.handleCollision);
        physijsScene.spawnObstacle('obstacle03', new THREE.Vector3( -50, 150, 250), new THREE.Vector3( 50, 10, 50), new THREE.Vector3( 0, 0, 0), "rgb(0, 255, 0)", physijsScene.handleCollision);
        physijsScene.spawnObstacle('obstacle04', new THREE.Vector3( 50, 210, 200), new THREE.Vector3( 50, 10, 50), new THREE.Vector3( 0, 0, 0), "rgb(255, 255, 0)", physijsScene.handleCollision);
        physijsScene.spawnObstacle('obstacle05', new THREE.Vector3( 100, 260, 200), new THREE.Vector3( 50, 10, 50), new THREE.Vector3( 0, 0, 0), "rgb(255, 127, 0)", physijsScene.handleCollision);
        physijsScene.spawnObstacle('obstacle06', new THREE.Vector3( 0, 320, 200), new THREE.Vector3( 50, 10, 50), new THREE.Vector3( 0, 0, 0), "rgb(127, 0, 255)", Utils.startLastPlatformAnim);

        vars.physicsScene.simulate();
    },
    spawnGround: function () {
        // Ground
        physijsScene.vars.ground_material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({}),
            0.8, // medium friction
            0 // high restitution
        );

        physijsScene.vars.ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(3000, 1, 3000),
            physijsScene.vars.ground_material,
            0 // mass
        );
        physijsScene.vars.physicsScene.add(physijsScene.vars.ground);
    },
    spawnPlayer: (position) => {
        let player_material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({}),
            .6, // medium friction
            1 // high restitution
        );

        let player_geometry = new Physijs.BoxMesh(
            new THREE.BoxGeometry(10, 10, 10),
            player_material,
            0.3, // mass
        );

        player_geometry.addEventListener('collision', physijsScene.handleCollision);
        player_geometry.position.set(position.x, position.y , position.z);
        physijsScene.vars.physicsScene.add(player_geometry);
        physijsScene.vars.player = player_geometry;
        Scene.addPlayerObject(10, position, new THREE.Vector3(0, 0, 0), new THREE.Color(0, 0, 0));
    },
    spawnObstacle(name, position, dimensions, rotation, color, collisionCallback) {
        let obstacle_material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({}),
            1, // medium friction
            0 // high restitution
        );

        let obstacle_geometry = new Physijs.BoxMesh(
            new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z),
            obstacle_material,
            0, // mass
        );

        obstacle_geometry.addEventListener('collision', collisionCallback);

        obstacle_geometry.position.set(position.x, position.y , position.z);
        obstacle_geometry.rotation.set(rotation.x, rotation.y, rotation.z);

        physijsScene.vars.obstacles[name] = obstacle_geometry;
        physijsScene.vars.physicsScene.add(obstacle_geometry);

        Scene.addObstacle(name, position, rotation, dimensions, color);
    },
    updateTruePlayer: () => {
        let playerPos = physijsScene.vars.player.position;
        Scene.vars.player.position.set(playerPos.x, playerPos.y, playerPos.z);
    },
    handleCollision: (collided_with, linearVelocity, angularVelocity) => {
        Utils.vars.collidedWithFloor = true;
    },
};
window.onload = physijsScene.initScene;

export {
    physijsScene
}
