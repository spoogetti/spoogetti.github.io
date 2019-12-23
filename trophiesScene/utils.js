import {Scene} from './scene.js'
import {physijsScene} from './physijsScene.js'
import {Ball} from './ball.js'

const Utils = {
    vars: {
        gui: null,
    },
    controller: new function() {
        // GLOBAL PROPS
        this.fov = 45;
        this.gravity = 300;
        // BALL PROPS
        this.segments = Ball.vars.ballSegments;
        this.ballRadius = Ball.vars.ballRadius;
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
            Utils.updateButton();
        }
    },
    updateButton: () => {
        if(Scene.vars.buttonClicked) {
            Utils.animateBallFloodButton(true);
            physijsScene.spawnSphere();
        } else
            Utils.animateBallFloodButton(false);
    },
    animateBallFloodButton: (buttonClicked) => {
        let buttonPosition = Scene.vars.button.position;
        let tween = new TWEEN.Tween(buttonPosition);
        tween.easing(TWEEN.Easing.Elastic.Out);
        // tween.interpolation(TWEEN.Interpolation.Bezier);
        let colorChanged = false;
        if(buttonClicked) {
            tween.to({ y: 25 }, 1000).onUpdate(function(position) {
                if(position.y < 25 && !colorChanged) {
                    Scene.vars.button.traverse((child) => {
                        if(child.isMesh) {
                            child.material.color = new THREE.Color(0x4CA64C);
                        }
                    });
                }
            }).start();
        } else {
            tween.to({ y: 40 }, 1000).onUpdate(function(position) {
                if(position.y > 40 && !colorChanged) {
                    Scene.vars.button.traverse((child) => {
                        if(child.isMesh) {
                            child.material.color = new THREE.Color(0xEDC25E);
                        }
                    });
                }
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
        globalProps.add(Utils.controller, 'gravity', 1, 1000).onChange(function () {
            physijsScene.vars.physicsScene.setGravity(new THREE.Vector3( 0, -Utils.controller.gravity, 0 ));
        });


        let ballsProps = Utils.vars.gui.addFolder('Ball');
        ballsProps.add(Utils.controller, 'segments', 1, 100).onChange(function () {
            Ball.vars.ballSegments = Utils.controller.segments;
        });
        ballsProps.add(Utils.controller, 'ballRadius', 1, 100).onChange(function () {
            Ball.vars.ballRadius = Utils.controller.ballRadius;
        });
    }
};

export {
    Utils,
}
