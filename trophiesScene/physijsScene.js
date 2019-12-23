Physijs.scripts.worker = '../libs/physijs_worker.js';
Physijs.scripts.ammo = '../libs/ammo.js';

import {Scene} from './scene.js';
import {Ball} from './ball.js';

const physijsScene = {
    vars: {
        loader: new THREE.TextureLoader(),
        physicsScene: new Physijs.Scene,
        ground_material: null,
        ground: null,
        light: null,
    },

    initScene : function() {
        let vars = physijsScene.vars;

        vars.physicsScene.setGravity(new THREE.Vector3( 0, /*-9.8*/ -500, 0 ));
        vars.physicsScene.addEventListener(
            'update',
            function() {
                vars.physicsScene.simulate(undefined, 1);
            }
        );

        // Ground
        vars.ground_material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({}),
            .4, // medium friction
            1.2 // high restitution
        );

        vars.ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(1000, 1, 1000),
            vars.ground_material,
            0 // mass
        );
        vars.ground.receiveShadow = false;
        vars.physicsScene.add(vars.ground);
        physijsScene.spawnSphere();
        physijsScene.spawnTrophyGroup(new THREE.Vector3( 0, 0, -50), new THREE.Vector3( 0, 0, 0));
        physijsScene.spawnTrophyGroup(new THREE.Vector3( 200, 0, 0), new THREE.Vector3( 0, -Math.PI/4, 0));
        physijsScene.spawnTrophyGroup(new THREE.Vector3( -200, 0, 0), new THREE.Vector3( 0, Math.PI/4, 0));
        physijsScene.spawnButton(new THREE.Vector3( 0, 0, 200), new THREE.Vector3( 0, 0, 0));

        vars.physicsScene.simulate();
    },
    spawnSphere: (() => {
        let sphere_geometry = new THREE.SphereGeometry(Ball.vars.ballRadius, 2, 2),
            handleCollision = function(collided_with, linearVelocity, angularVelocity) {},
            createSphere = function() {
                let sphere, material;

                material = Physijs.createMaterial(new THREE.MeshBasicMaterial({}),
                    .6, // medium friction
                    1.2 // high restitution
                );
                sphere = new Physijs.SphereMesh(sphere_geometry, material);
                sphere.collisions = 0;

                // Impossible d'ajouter une linear velocity
                // let pos = new THREE.Vector3();
                // pos.copy( Scene.vars.raycaster.ray.direction );
                // pos.multiplyScalar(1400);
                // console.log(pos);
                // sphere.setLinearVelocity(new THREE.Vector3(5000, pos.y, pos.z));

                sphere.position.set(Math.random() * 100 - 50, 400, Math.random() * 100 - 100);

                sphere.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                // sphere.addEventListener('collision', handleCollision);
                if(Scene.vars.buttonClicked) {
                    sphere.addEventListener('ready', physijsScene.spawnSphere);
                    physijsScene.vars.physicsScene.add(sphere);
                    Ball.addBall(sphere);
                }
            };

        return function() {
            if(Scene.vars.buttonClicked)
                setTimeout(createSphere, 600);
        };
    })(),
    spawnTrophyGroup: (position) => {
        let box_material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({}),
            .6, // medium friction
            1.1 // high restitution
        );

        let pedestal_geometry = new Physijs.BoxMesh(
            new THREE.BoxGeometry(100, 120, 100),
            box_material,
            0 // mass
        );

        let statue_geometry = new Physijs.BoxMesh(
            new THREE.BoxGeometry(20, 260, 20),
            box_material,
            0 // mass
        );

        pedestal_geometry.position.set(position.x, position.y, position.z);
        statue_geometry.position.set(position.x, position.y + 50 , position.z);

        physijsScene.vars.physicsScene.add(pedestal_geometry);
        physijsScene.vars.physicsScene.add(statue_geometry);
    },
    spawnButton: (position) => {
        let button_material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({}),
            .6, // medium friction
            1 // high restitution
        );

        let button_geometry = new Physijs.BoxMesh(
            new THREE.BoxGeometry(90, 70, 30),
            button_material,
            0 // mass
        );

        button_geometry.position.set(position.x, position.y , position.z);
        physijsScene.vars.physicsScene.add(button_geometry);
    },
};
window.onload = physijsScene.initScene;

export {
    physijsScene
}
