# Scene Graph Engine for PIXI

Link to [API documentation](https://enriko-riba.github.io/pixi-scenegraph/generated/index.html)

## What is pixi-scenegraph?
**pixi-scenegraph** is a library providing scene management features and several common prefab display objects.
It is written in typescript and aimed for typescript users but not limited to typescript only projects.
>*.ts -> import {SceneManager} from "pixi-scenegraph";

>*.js -> var sg = require("pixi-scenegraph"); let scm = new sg.SceneManager();

### Show me da stuff

The following image represents the object hierarchy:

![Hierarchy](https://enriko-riba.github.io/pixi-scenegraph/img/Hierarchy.png "Object hierarchy")


### What is a Scene
A Scene is like a PIXI stage, a container holding all objects we want to display. Think of scenes as game state containers e.g: loading scene, menu scene, options scene, in-game scene etc. 

A scene **must have a unique name** and the SceneManager can reference scenes by that name:

    sceneManager.ActivateScene("sceneName");

Only one scene at a time is active and only the active scene is rendered. A scene can have a HudOverlay which is a container object rendered over the scene. In addition a MasterHudOverlay can be attached to the SceneManager. The MasterHudOverlay is rendered over all other content.

Z-Index

![z ordering](https://enriko-riba.github.io/pixi-scenegraph/img/zindex.png "Z Ordering")

### Show me a 'Hello World' example
    const scm = new SceneManager(SCENE_WIDTH, SCENE_HEIGHT, renderOptions);
    const myScene = new MyScene(scm);
    scm.AddScene(myScene);
    scm.ActivateScene(myScene);

### How do I switch scenes?
    const myScene1 = new MyScene1(scm);     //  name id 'scene_1'
    const myScene2 = new MyScene2(scm);     //  name id 'scene_2'
    const menuScene = new MenuScene(scm);   //  name id 'menu'
    scm.AddScene(myScene1);
    scm.AddScene(myScene2);
    scm.AddScene(menuScene);
    scm.ActivateScene(menuScene);

inside the MenuScene class:

    btnStart.onClick = () => this.sceneManager.ActivateScene("scene_1");

### Documentation
[API documentation](https://enriko-riba.github.io/pixi-scenegraph/generated/index.html)
