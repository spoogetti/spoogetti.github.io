import {Scene} from './scene.js'
import {physijsScene} from "./physijsScene.js";

const Utils = {
    vars: {
        gui: null,
        keysPressed: [],
        xSpeed: 5,
        zSpeed: 5,
        jumpMomentum: 100,
        collidedWithFloor: false,
        endAnimLaunched: false,
    },
    controller: new function() {
        // GLOBAL PROPS
        this.fov = 45;
        this.gravity = 100;
    }(),
    cloneMaterial: (objChild) => {
        if(objChild.isMesh)
            objChild.material = objChild.material.clone();
        return objChild;
    },
    onMouseMove: (event) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        Scene.vars.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        Scene.vars.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        Scene.vars.mouseMoved = true;
    },
    onMouseDown: (event) => {
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);
        let intersects = Scene.vars.raycaster.intersectObject(Scene.vars.button, true);
        let raycastUpdate = intersects.length > 0;

        if(raycastUpdate) {
            Scene.vars.buttonClicked = !Scene.vars.buttonClicked;

            let playerPos = physijsScene.vars.player.position;
            physijsScene.vars.player.__dirtyPosition = true;

            let tweenPlayer = new TWEEN.Tween(playerPos);

            tweenPlayer.easing(TWEEN.Easing.Quartic.In);

            tweenPlayer.to({ y: 2000 }, 3000).onUpdate((object) => {
                physijsScene.vars.player.__dirtyPosition = true;
            }).onComplete(() => {
                Utils.goto('\/trophiesScene\/index.html')
            }).start();

        }
    },
    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    initDatGui: () => {
        Utils.vars.gui = new dat.GUI();

        let guiContainer = document.createElement('div');
        guiContainer.setAttribute("style", "position : absolute; right: 0;");
        guiContainer.appendChild(Utils.vars.gui.domElement);
        Scene.vars.container.appendChild(guiContainer);

        let globalProps = Utils.vars.gui.addFolder('Global Props');
        globalProps.add(Utils.controller, 'fov', 1, 180).onChange(function () {
            Scene.vars.camera.fov = Utils.controller.fov;
            Scene.vars.camera.updateProjectionMatrix();
        });
    },
    onDocumentKeyDownOrUp: (event) => {
        if(event.keyCode !== 'undefined')
            Utils.vars.keysPressed[event.keyCode] = event.type === 'keydown';
    },
    processKeyDownEvents: () => {
        if(Scene.vars.playerCreated) {
            let playerLinearVelocity = physijsScene.vars.player.getLinearVelocity();
            if (Utils.vars.keysPressed[83]) {
                physijsScene.vars.player.setLinearVelocity(
                    new THREE.Vector3(playerLinearVelocity.x, playerLinearVelocity.y, playerLinearVelocity.z + Utils.vars.zSpeed));
            }
            if (Utils.vars.keysPressed[90]){
                physijsScene.vars.player.setLinearVelocity(
                    new THREE.Vector3(playerLinearVelocity.x, playerLinearVelocity.y, playerLinearVelocity.z - Utils.vars.zSpeed));
            }
            if (Utils.vars.keysPressed[81]){
                physijsScene.vars.player.setLinearVelocity(
                    new THREE.Vector3(playerLinearVelocity.x - Utils.vars.xSpeed, playerLinearVelocity.y, playerLinearVelocity.z));
            }
            if (Utils.vars.keysPressed[68]){
                physijsScene.vars.player.setLinearVelocity(
                    new THREE.Vector3(playerLinearVelocity.x + Utils.vars.xSpeed, playerLinearVelocity.y, playerLinearVelocity.z));
            }
            if (Utils.vars.keysPressed[32] && Utils.vars.collidedWithFloor) {
                physijsScene.vars.player.setLinearVelocity(
                    new THREE.Vector3(0, playerLinearVelocity.y + Utils.vars.jumpMomentum, 0));
                Utils.vars.collidedWithFloor = false;
            }
        }
    },
    resetPlayer: () => {
        let resetPos = new THREE.Vector3( 0, 15, 500);
        physijsScene.vars.player.position.set(resetPos.x, resetPos.y, resetPos.z);
        physijsScene.vars.player.__dirtyPosition = true;
        Utils.vars.collidedWithFloor = true;
    },
    startLastPlatformAnim: () => {
        if(!Utils.vars.endAnimLaunched) {
            Utils.vars.endAnimLaunched = true;
            let posText1 = Scene.vars.textObjects['Romain'].position;
            let posText2 = Scene.vars.textObjects['Roubaix'].position;
            let posButton = Scene.vars.buttonGroup.position;

            let tweenText1 = new TWEEN.Tween(posText1);
            let tweenText2 = new TWEEN.Tween(posText2);
            let tweenButton = new TWEEN.Tween(posButton);

            tweenText1.easing(TWEEN.Easing.Quartic.Out);
            tweenText2.easing(TWEEN.Easing.Quartic.Out);
            tweenButton.easing(TWEEN.Easing.Quartic.Out);

            tweenText1.to({ x: -200 }, 4000).start();
            tweenText2.to({ x: -100 }, 4000).start();
            tweenButton.to({x: 170}, 4500).start();
        }
    },
    goto: (path) => {
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + path;
    }
};

export {
    Utils,
}
