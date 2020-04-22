/**
 * @File   : MainLevelScript.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: MainLevelScript.
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls/lib/CameraOrbitControlComponent';

import FloatingComponent from '../components/FloatingComponent';

export default class MainLevelScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'miku.gltf', url: require('assets/gltfs/miku.gltf')});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state.current, state.progress);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    const camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
      far: 1000,
      near: .01,
      fov: 60,
      aspect: game.screenWidth / game.screenHeight,
      position: new Sein.Vector3(0, 12, -25)
    });
    camera.lookAt(new Sein.Vector3(0, 12, 0));

    camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
      enableDamping: true,
      dampingFactor: .2,
      zoomMax: 100,
      zoomMin: .1,
      target: new Sein.Vector3(0, 12, 0)
    });

    const box1 = world.addActor('box1', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(1, 0, 0)}),
      position: new Sein.Vector3(-8, 10, 0)
    });
    box1.addComponent('floating', FloatingComponent, {amp: 1, omega: 2});

    world.addActor('box2', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(0, 1, 0)}),
      position: new Sein.Vector3(8, 10, 0)
    });

    world.addActor('aLight', Sein.AmbientLightActor, {
      color: new Sein.Color(1, 1, 1),
      amount: .5
    });
    world.addActor('dLight', Sein.DirectionalLightActor, {
      direction: new Sein.Vector3(0, -1, 1),
      color: new Sein.Color(1, 1, 1),
      amount: 2
    });

    const miku = game.resource.instantiate<'GlTF'>('miku.gltf').get(0);
    miku.transform.setPosition(0, 0, 4);
  }

  public onUpdate() {
    const box2 = Sein.findActorByName(this.getWorld(), 'box2');
    box2.transform.rotate(box2.transform.upVector, .02);
  }
}
