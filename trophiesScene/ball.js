import * as THREE from '../libs/three.module.js';

import {Scene} from './scene.js';
import {physijsScene} from './physijsScene.js';

const Ball = {
    vars: {
        nbMaxBalls: 50,
        generatedBallsAmount: 0,
        ballRadius: 15,
        ballSegments: 30,
        balls: [],
    },
    addBallFloodButton: (position, rotation) => {
        let pedestal_geometry = new THREE.BoxGeometry(100, 50, 40);
        let pedestal_material =  new THREE.MeshBasicMaterial({
            map: Scene.vars.textureMarbre,
            // color :  new THREE.Color(0xffffff),
        });
        let pedestal = new THREE.Mesh(pedestal_geometry, pedestal_material);

        let button_geometry = new THREE.BoxGeometry(90, 30, 30);
        let button_material =  new THREE.MeshBasicMaterial({
            // map: Scene.vars.textureMarbre,
            color :  new THREE.Color(0xEDC25E),
        });
        let button = new THREE.Mesh(button_geometry, button_material);

        pedestal.position.set(position[0], position[1], position[2]);
        pedestal.rotation.set(rotation[0], rotation[1], rotation[2]);

        button.position.set(position[0], position[1] + 30, position[2]);
        button.rotation.set(rotation[0], rotation[1], rotation[2]);

        Scene.vars.scene.add(pedestal);
        Scene.vars.scene.add(button);

        Scene.vars.button = button;
    },
    addBall: (sphere) => {
        let trueSphereGeometry = new THREE.SphereGeometry(Ball.vars.ballRadius, Ball.vars.ballSegments, Ball.vars.ballSegments);
        let trueSphereMaterial =
            new THREE.MeshStandardMaterial({
                map: Scene.vars.texturePlywood,
                // color :  new THREE.Color(Math.random() * 0xffffff),
                roughness : 0.8,
                // metalness : 0.3,
            });
        let trueSphere = new THREE.Mesh(trueSphereGeometry, trueSphereMaterial);
        trueSphere.position.set(sphere.position.x, sphere.position.y, sphere.position.z) ;
        Scene.vars.scene.add(trueSphere);
        Ball.vars.generatedBallsAmount++;
        let currentBallId = Ball.vars.generatedBallsAmount%Ball.vars.nbMaxBalls;
        if(Ball.vars.balls[currentBallId] != null)
            Ball.deleteBall(Ball.vars.balls[currentBallId]);
        Ball.vars.balls[currentBallId] = [sphere, trueSphere];
        // if(Ball.vars.balls.length > 20)
        //     Ball.purgeInvalidBalls();
    },
    updateBallsPositions: () => {
        Ball.vars.balls.forEach(ball => {
            ball[1].position.set(ball[0].position.x, ball[0].position.y, ball[0].position.z);
            ball[1].rotation.set(ball[0].rotation.x, ball[0].rotation.y, ball[0].rotation.z);
        })
    },
    purgeInvalidBalls: () => {
        Ball.vars.balls.forEach((ball, index) => {
            if(ball[1].position.y < -10) {
                Ball.deleteBall(ball);
            }
        });
    },
    deleteBall: (ball) => {
        Scene.vars.scene.remove(ball[1]);
        physijsScene.vars.physicsScene.remove(ball[0]);
    }
};

export {
    Ball
}
