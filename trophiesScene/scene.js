// IMPORT DE THREE.JS
import * as THREE from '../three.js-master/build/three.module.js';
// import * as THREE from '../libs/three.module.js';
import {OrbitControls} from '../libs/controls/OrbitControls.js';
import Stats from '../libs/libs/stats.module.js';

import {Utils} from './utils.js';
import {Trophy} from './trophy.js';
import {Ball} from './ball.js';
import {physijsScene} from './physijsScene.js'

const Scene = {
    vars: {
        containers: null,
        scene: null,
        renderer: null,
        camera: null,
        controls: null,
        stats: null,
        mouse: THREE.Vector2,
        mouseMoved: false,
        raycaster: new THREE.Raycaster(),
        frustum: 1000,
        browserOption: '',
        debugMode: false,
    },
    init: () => {
        let vars = Scene.vars;

        vars.container = document.createElement('div');
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        let windowLocation = window.location.href;
        vars.browserOption = decodeURI(windowLocation.split('#')[1]);
        if(vars.browserOption !== 'undefined')
            vars.debugMode = vars.browserOption === 'debug';

        // CRÉATION DE LA SCÈNE
        vars.scene = new THREE.Scene();
        // vars.scene.background = new THREE.Color(0xa0a0a0);
        // vars.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1500 );

        vars.renderer = new THREE.WebGLRenderer({antialias: true});
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);

        if(vars.debugMode) {
            // DAT.GUI
            Utils.initDatGui();

            // HELPER D'AXES
            let axesHelper = new THREE.AxesHelper( 50 );
            vars.scene.add(axesHelper);

            // AJOUT DES TEXTURES HELPER SUR LE SOL
            let grid = new THREE.GridHelper(2000, 4, 0x000000, 0x000000);
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            vars.scene.add(grid);
        }

        // AJOUT DES OMBRES
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;

        vars.container.appendChild(vars.renderer.domElement);

        // CRÉATION DE LA CAMÉRA
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
        vars.camera.position.set(-1.5, 210, 572);

        // CRÉATION D’UNE LUMIÈRE
        let lightIntensity = 1;

        let light = new THREE.HemisphereLight(0xffffff, 0x444444, lightIntensity/2);
        light.position.set(0, 1000, 0);
        vars.scene.add(light);

        // CRÉATION D’UN SOL
        let ground = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000, 2000),
            new THREE.MeshLambertMaterial({color: new THREE.Color(0xDADADA)})
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = false;
        //mesh.position.set(0, 0, 0);
        vars.scene.add(ground);

        // SOL TRANSPARENT POUR LES OMBRES
        let planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0.07;
        let shadowPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), planeMaterial);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.receiveShadow = true;
        vars.scene.add(shadowPlane);

        // FOG
        // vars.fog = new THREE.Fog( 0x000000, 500, 2000);
        // vars.scene.fog = vars.fog;

        // AJOUT DE 3 LUMIÈRES DIRECTIONNELLES
        Scene.addDirectionalLight('directional01', [0, 500, 700], lightIntensity, vars.frustum, true);
        Scene.addDirectionalLight('directional02', [-400, 100, 200], lightIntensity/2, vars.frustum, false);
        Scene.addDirectionalLight('directional03', [400, 100, 200], lightIntensity/2, vars.frustum, false);

        // CREATION DE LA SPHERE QUI ENGLOBE TOUT
        var sphereGeometry = new THREE.SphereBufferGeometry( 1000, 32, 32 );
        var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xFFFFFF, side : THREE.BackSide } );
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        vars.scene.add(sphere);

        // FONT & TEXT
        Scene.createTextObject();

        // AUTO RESIZE
        window.addEventListener('resize', Utils.onWindowResize, false);

        // MISE EN PLACE DES CONTROLS
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        vars.controls.target.set(0, 0, 0);

        if(!vars.debugMode) {
            vars.controls.minDistance = 300;
            vars.controls.maxDistance = 600;

            vars.controls.minAzimuthAngle = - Math.PI / 4;
            vars.controls.maxAzimuthAngle = Math.PI / 4;
        } else {
            vars.stats = new Stats();
            vars.container.appendChild(vars.stats.dom);
        }

        vars.controls.minPolarAngle = Math.PI / 4;
        vars.controls.maxPolarAngle = Math.PI / 2;

        vars.controls.target.set(0, 100, 0);

        vars.controls.update();

        // Ajout des objets 3D à la scène
        Trophy.loadFBX("Socle_Partie1.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "Socle_Partie1", () => {
            Trophy.loadFBX("Socle_Partie2.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "Socle_Partie2", () => {
                Trophy.loadFBX("Statuette.FBX", 10, [0, 0, 0], [0, 0, 0], 0xFFD700, "Statuette", () => {
                    Trophy.loadFBX("Plaquette.FBX", 10, [0, 4, 46], [0, 0, 0], 0xFFFFFF, "Plaquette", () => {
                        Trophy.loadFBX("Logo_Feelity.FBX", 10, [46, 22, 0], [0, 0, 0], 0xFFFFFF, "Logo_Feelity", () => {
                            vars.logoFeelity1 = vars.Logo_Feelity;
                            vars.logoFeelity2 = vars.Logo_Feelity.clone();

                            vars.logoFeelity2.position.set(-46, 22, 0);
                            vars.logoFeelity2.rotation.set(0, 0, Math.PI);

                            Trophy.addTrophyGroup("gold", new THREE.Color(0xFFD700), [0, 10, -50], [0, 0, 0]);
                            Trophy.addTrophyGroup("silver", new THREE.Color(0xC0C0C0), [-200, 10, 0], [0, Math.PI/4, 0]);
                            Trophy.addTrophyGroup("bronze", new THREE.Color(0xCD7F32), [200, 10, 0], [0, -Math.PI/4, 0]);
                            // Scene.addTrophyGroup("rose", new THREE.Color(0xB76E79), [0, 0, 0], [0, 0, 0]);

                            Scene.vars.texturePlywood = new THREE.TextureLoader().load('../textures/plywood.jpg');
                            Ball.addBallFloodButton([0, 10, 200], [0, 0, 0]);

                            window.addEventListener( 'mousemove', Utils.onMouseMove, false );
                            window.addEventListener( 'click', Utils.onMouseDown, false );

                            Scene.animate();
                            $("#loading").remove();
                        });
                    });
                });
            });
        });
    },
    // LANCEMENT DE L’ANIMATION
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Trophy.applyIntersectExplosionOnTrophies();
        Ball.updateBallsPositions();
        TWEEN.update();
        if(Scene.vars.debugMode)
            Scene.vars.stats.update();
    },
    addDirectionalLight: (name,  position, lightIntensity, frustum, shadowSupport = true) => {
        let directional = new THREE.DirectionalLight(0xffffff, lightIntensity);
        directional.position.set(position[0], position[1], position[2]);
        Scene.vars.scene.add(directional);

        directional.castShadow = shadowSupport;
        directional.receiveShadow = shadowSupport;
        directional.shadow.camera.left = -frustum;
        directional.shadow.camera.right = frustum;
        directional.shadow.camera.top = frustum;
        directional.shadow.camera.bottom = -frustum;
        directional.shadow.camera.far = 2000;
        directional.shadow.mapSize.width = 4096;
        directional.shadow.mapSize.height = 4096;

        Scene.vars[name] = directional;

        if(Scene.vars.debugMode){
            let helper = new THREE.DirectionalLightHelper(directional, 5);
            Scene.vars.scene.add(helper);
            Scene.vars[name + 'Helper'] = helper;
        }
    },
    createTextObject: function () {
        let loader = new THREE.FontLoader();
        loader.load(
            '../fonts/helvetiker_bold.typeface.json',
            (font) => {
                Scene.vars.font = font;
                let textGeometry = new THREE.TextGeometry((Scene.vars.browserOption !== 'undefined') ? Scene.vars.browserOption : "DAWIN", {
                    font: font,
                    size: 10,
                    height: 1,
                });
                let textMaterial = new THREE.MeshStandardMaterial({color: 0x000000,});
                Scene.vars.textObject = new THREE.Mesh(textGeometry, textMaterial);

                textGeometry.computeBoundingBox();
                let bb = textGeometry.boundingBox;
                let object3DWidth = bb.max.x - bb.min.x;

                Scene.vars.textObject.position.x = -(object3DWidth / 2);
                Scene.vars.textObject.position.y = 15;
                Scene.vars.textObject.position.z = 47;
            }
        );
    },
};

Scene.init();

export {
    Scene
}
