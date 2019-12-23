// IMPORT DE THREE.JS
import * as THREE from '../libs/three.module.js';
import {OrbitControls} from '../libs/controls/OrbitControls.js';
import Stats from '../libs/libs/stats.module.js';

import {Utils} from './utils.js';
import {physijsScene} from './physijsScene.js'

const Scene = {
    vars: {
        containers: null,
        scene: null,
        renderer: null,
        textureLoader: null,
        camera: null,
        controls: null,
        stats: null,
        mouse: THREE.Vector2,
        mouseMoved: false,
        loaded: false,
        raycaster: new THREE.Raycaster(),
        frustum: 1000,
        browserOption: '',
        debugMode: false,
        playerCreated: false,
        textObjects: [],
        obstacles: [],
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

        // TEXTURE DE FOND
        vars.textureLoader = new THREE.TextureLoader();
        vars.textureLoader.load('../textures/starryNight.jpg' , function(texture) {
            vars.scene.background = texture;
        });

        vars.renderer = new THREE.WebGLRenderer({antialias: true});
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);

        if(vars.debugMode) {
            // DAT.GUI
            Utils.initDatGui();

            // HELPER D'AXES
            let axesHelper = new THREE.AxesHelper(50);
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
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);

        // CRÉATION D’UNE LUMIÈRE
        let lightIntensity = 1;

        let light = new THREE.HemisphereLight(0xffffff, 0x444444, lightIntensity);
        light.position.set(0, 1000, 0);
        vars.scene.add(light);

        // FONT & TEXT
        // Scene.createTextObject("DAWIN ALT", 60,
        //     new THREE.Vector3(0, 550, 0), new THREE.Vector3(0, 0, 0), new THREE.Color(0, 0, 100));
        Scene.createTextObject("Romain", 60,
            new THREE.Vector3(-1500, 400, 0), new THREE.Vector3(0, 0, 0), new THREE.Color(255, 255, 255));
        Scene.createTextObject("Roubaix", 60,
            new THREE.Vector3(1500, 310, 0), new THREE.Vector3(0, 0, 0), new THREE.Color(0, 0, 0));

        vars.fontLoader = new THREE.FontLoader();
        vars.textureLoader.load('../textures/marbre.jpg' , function(texture) {
            vars.fontLoader.load('../fonts/helvetiker_bold.typeface.json', (font) => {
                vars.textureMarbre = texture;
                vars.font = font;
                Scene.addNextSceneButton(new THREE.Vector3(1700, 420, 0), new THREE.Vector3(Math.PI, 0, Math.PI));
            });
        });

        // AUTO RESIZE
        window.addEventListener('resize', Utils.onWindowResize, false);

        if(vars.debugMode) {
            vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
            vars.controls.target.set(0, 0, 0);

            vars.stats = new Stats();
            vars.container.appendChild(vars.stats.dom);

            vars.camera.position.set(0, 0, 600);
        }

        document.addEventListener("keydown", Utils.onDocumentKeyDownOrUp, false);
        document.addEventListener("keyup", Utils.onDocumentKeyDownOrUp, false);
        window.addEventListener( 'mousemove', Utils.onMouseMove, false );
        window.addEventListener( 'click', Utils.onMouseDown, false );

        Scene.animate();
    },
    // LANCEMENT DE L’ANIMATION
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Utils.processKeyDownEvents();
        TWEEN.update();
        if(Scene.vars.playerCreated) {
            physijsScene.updateTruePlayer();
            if(Scene.vars.player.position.y < -20)
                Utils.resetPlayer();
            if(!Scene.vars.debugMode) {
                let playerPos = Scene.vars.player.position;
                Scene.vars.camera.position.set(playerPos.x, playerPos.y + 30, playerPos.z + 130);
            }
        }
        if(Scene.vars.debugMode)
            Scene.vars.stats.update();
    },
    createTextObject: function (text, size, position, rotation, color) {
        let loader = new THREE.FontLoader();
        loader.load(
            '../fonts/helvetiker_bold.typeface.json',
            (font) => {
                Scene.vars.font = font;
                let textGeometry = new THREE.TextGeometry(text, {
                    font: font,
                    size: size,
                    height: 10,
                });
                let textMaterial = new THREE.MeshStandardMaterial({color: color});
                let textMesh = new THREE.Mesh(textGeometry, textMaterial);

                textGeometry.computeBoundingBox();
                let bb = textGeometry.boundingBox;
                let object3DWidth = bb.max.x - bb.min.x;

                textMesh.position.x = -(object3DWidth / 2) + position.x;
                textMesh.position.y = position.y;
                textMesh.position.z = position.z;

                Scene.vars.scene.add(textMesh);
                Scene.vars.textObjects[text] = textMesh;
            }
        );
    },
    addPlayerObject: function (size, position, rotation, color) {
        let player_geometry = new THREE.BoxGeometry(size, size, size);
        let player_material =  new THREE.MeshBasicMaterial({
            // map: Scene.vars.textureMarbre,
            color :  new THREE.Color(color),
        });
        let player = new THREE.Mesh(player_geometry, player_material);
        player.position.set(position.x, position.y, position.z);
        player.rotation.set(rotation.x, rotation.y, rotation.z);

        Scene.vars.player = player;
        Scene.vars.scene.add(player);
        Scene.vars.playerCreated = true;
    },
    addObstacle: (name, position, rotation, dimensions, color) => {
        let obstacle_geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        let obstacle_material =  new THREE.MeshBasicMaterial({
            color : color,
        });
        let obstacle = new THREE.Mesh(obstacle_geometry, obstacle_material);
        obstacle.position.set(position.x, position.y, position.z);
        obstacle.rotation.set(rotation.x, rotation.y, rotation.z);

        Scene.vars.obstacles[name] = obstacle;
        Scene.vars.scene.add(obstacle);
    },
    addNextSceneButton: (position, rotation) => {
        let pedestal_geometry = new THREE.BoxGeometry(70, 70, 40);
        let pedestal_material =  new THREE.MeshBasicMaterial({
            map: Scene.vars.textureMarbre,
        });
        let pedestal = new THREE.Mesh(pedestal_geometry, pedestal_material);

        let button_geometry = new THREE.BoxGeometry(60, 60, 30);
        let button_material =  new THREE.MeshBasicMaterial({
            color :  new THREE.Color(0xEDC25E),
        });
        let button = new THREE.Mesh(button_geometry, button_material);

        let textGeometry = new THREE.TextGeometry('Click Me', {
            font: Scene.vars.font,
            size: 9,
            height: 10,
        });

        let textMaterial = new THREE.MeshStandardMaterial({color: 0x000});
        let text = new THREE.Mesh(textGeometry, textMaterial);

        pedestal.position.set(0, 0, 0);
        pedestal.rotation.set(0, 0, 0);

        button.position.set(0, 0, -15);
        button.rotation.set(0, 0, 0);

        textGeometry.computeBoundingBox();
        let bb = textGeometry.boundingBox;
        let object3DWidth = bb.max.x - bb.min.x;
        text.position.set((object3DWidth / 2), 0, -20);
        text.rotation.set(0, Math.PI, 0);

        let buttonGroup = new THREE.Group();
        buttonGroup.add(pedestal);
        buttonGroup.add(button);
        buttonGroup.add(text);

        buttonGroup.position.set(position.x, position.y, position.z);
        buttonGroup.rotation.set(rotation.x, rotation.y, rotation.z);

        Scene.vars.scene.add(buttonGroup);

        Scene.vars.pedestal = pedestal;
        Scene.vars.button = button;
        Scene.vars.buttonText = text;
        Scene.vars.buttonGroup = buttonGroup;

    },
};

Scene.init();

export {
    Scene
}
