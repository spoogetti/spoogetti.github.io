import * as THREE from '../libs/three.module.js';
import {FBXLoader} from '../three.js-master/examples/jsm/loaders/FBXLoader.js';

import {Utils} from './utils.js';
import {Scene} from './scene.js';

const Trophy = {
    vars: {
        intersectsGold: false,
        intersectsSilver: false,
        intersectsBronze: false,
        translationGold: 0,
        translationSilver: 0,
        translationBronze: 0,
        translationStep: 3,
    },
    loadFBX: (file, scale, position, rotation, color, name, callback) => {
        let loader = new FBXLoader();
        loader.load("../fbx/" + file, function (object) {
            object.scale.set(scale, scale, scale);

            // Dans l'idéal se débarrasser de ces mutateurs
            object.position.set(position[0], position[1], position[2]);
            object.rotation.set(rotation[0], rotation[1], rotation[2]);

            object.traverse((child) => {
                if(child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if(name === "Plaquette") {
                        Scene.vars.textureMarbre = new THREE.TextureLoader().load('../textures/marbre.jpg');
                        child.material = new THREE.MeshBasicMaterial({map: Scene.vars.textureMarbre});
                    } else
                        child.material.color = new THREE.Color(color);
                }
            });

            Scene.vars[name] = object;
            callback();
        });
    },
    addTrophyGroup: (name, color, position, rotation) => {
        // SOCLE PARTIE 1
        let soclePartie1 = Scene.vars.Socle_Partie1.clone();
        soclePartie1.traverse((child) => {
            Utils.cloneMaterial(child);
        });
        // SOCLE PARTIE 2
        let soclePartie2 = Scene.vars.Socle_Partie2.clone();
        soclePartie2.traverse((child) => {
            Utils.cloneMaterial(child);
        });
        // STATUETTE
        let statuette = Scene.vars.Statuette.clone();
        statuette.traverse((child) => {
                if (child.isMesh) {
                    child.material =  new THREE.MeshStandardMaterial({
                        color :  new THREE.Color(color),
                        roughness : 0.3,
                        metalness : 0.6,
                    });
                }
            }
        );

        // PLAQUETTE
        let plaquette = Scene.vars.Plaquette.clone();
        plaquette.traverse((child) => {
            Utils.cloneMaterial(child);
        });
        // LOGO FEELITY PARTIE 1
        let logoFeelity1 = Scene.vars.logoFeelity1.clone();
        logoFeelity1.traverse((child) => {
            Utils.cloneMaterial(child);
        });
        // LOGO FEELITY PARTIE 2
        let logoFeelity2 = Scene.vars.logoFeelity2.clone();
        logoFeelity2.traverse((child) => {
            Utils.cloneMaterial(child);
        });
        // TEXT
        let textObject = Scene.vars.textObject.clone();
        textObject.traverse((child) => {
            Utils.cloneMaterial(child);
        });

        let group = new THREE.Group();
        group.add(soclePartie1);
        group.add(soclePartie2);
        group.add(statuette);
        group.add(plaquette);
        group.add(logoFeelity1);
        group.add(logoFeelity2);
        group.add(textObject);

        Scene.vars.scene.add(group);
        Scene.vars[name] = group;

        group.position.x = position[0];
        group.position.y = position[1];
        group.position.z = position[2];

        group.rotation.x = rotation[0];
        group.rotation.y = rotation[1];
        group.rotation.z = rotation[2];
    },
    explodeTrophy : (trophy, translationStep, raycastUpdate, translationValue) => {
        let soclePartie1 = trophy.children[0];
        let soclePartie2 = trophy.children[1];
        let statuette = trophy.children[2];
        let plaquette = trophy.children[3];
        let logoFeelity1 = trophy.children[4];
        let logoFeelity2 = trophy.children[5];
        let textObject = trophy.children[6];

        if(translationValue + translationStep <= 0)
            translationValue = 0;
        else if(translationValue + translationStep >= 100)
            translationValue = 100;
        else
            translationValue += translationStep;

        // SoclePartie1
        if(translationValue < 50 && translationValue >= 30)
            soclePartie1.position.x = translationValue - 32;
        // // SoclePartie2
        if(translationValue < 50 && translationValue >= 30)
            soclePartie2.position.x = -translationValue + 32;
        // statuette
        if(translationValue < 90 && translationValue > 40)
            statuette.position.y = translationValue - 42;
        // plaquette
        if(translationValue < 30 && translationValue > 0)
            plaquette.position.z = 46 + translationValue;
        // logofeelity1
        if(translationValue < 50 && translationValue > 0)
            logoFeelity1.position.x = 42 + translationValue;
        // logofeelity2
        if(translationValue < 50 && translationValue > 0)
            logoFeelity2.position.x = -42 - translationValue;
        // textobject
        if(translationValue < 50 && translationValue > 0)
            textObject.position.z = 47 + translationValue;

        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);
        let intersects = Scene.vars.raycaster.intersectObjects(trophy.children, true);
        raycastUpdate = intersects.length > 0;

        if(trophy === Scene.vars.gold)
            Trophy.vars.intersectsGold = raycastUpdate;
        else if(trophy === Scene.vars.silver)
            Trophy.vars.intersectsSilver = raycastUpdate;
        else if(trophy === Scene.vars.bronze)
            Trophy.vars.intersectsBronze = raycastUpdate;
        else
            Scene.vars.mouseMoved = false;

        return translationValue;
    },
    applyIntersectExplosion : (trophy, intersects, translationValue) => {
        if(trophy != null && Scene.vars.mouseMoved)
            if(intersects)
                translationValue = Trophy.explodeTrophy(trophy, Trophy.vars.translationStep, intersects, translationValue);
            else
                translationValue = Trophy.explodeTrophy(trophy, -Trophy.vars.translationStep, intersects, translationValue);
        return translationValue;
    },
    applyIntersectExplosionOnTrophies : () => {
        Trophy.vars.translationGold = Trophy.applyIntersectExplosion(Scene.vars.gold, Trophy.vars.intersectsGold, Trophy.vars.translationGold);
        Trophy.vars.translationSilver = Trophy.applyIntersectExplosion(Scene.vars.silver, Trophy.vars.intersectsSilver, Trophy.vars.translationSilver);
        Trophy.vars.translationBronze = Trophy.applyIntersectExplosion(Scene.vars.bronze, Trophy.vars.intersectsBronze, Trophy.vars.translationBronze);
    }
};

export {
    Trophy
}
