/// --- Set up a system ---

import { Potion } from "./potion"
import { Cauldren } from "./cauldren"
import { Level } from "./level"
import { Sign } from "./sign"

const canvas = new UICanvas()

// Create a textShape component, setting the canvas as parent
const text = new UIText(canvas)
const text2 = new UIText(canvas)
text.value = ""
text2.value = ""

text.fontSize = 20
text2.fontSize = 20
text.positionY = -20
text2.positionY = -40

let isHolding: boolean = false

// Configuration
const Z_OFFSET = 1
const Y_OFFSET = 0.6
const GROUND_HEIGHT = 0.01
const camera = Camera.instance;

const offset = 15.9

let milliSeconds = 0;

let potionCount = 0;

class UISystem implements ISystem {




  constructor() {
      
  }
  
  //Executed ths function on every frame
  update(dt: number) {
    milliSeconds -= dt;
    if(milliSeconds>0){
      if(potionCount==0){
        text.value = "YOU WIN"
        text2.value = ""
      } else {
        text.value = "Chain reaction time left: " + milliSeconds.toFixed(0)
        text2.value = "Potions left to collect " + potionCount;
      }
    }
    else {
      text.value = ""
      text2.value = ""
    }
  }
}

// Add system to engine
engine.addSystem(new UISystem())

// Sounds
const pickUpSound = new Entity()
pickUpSound.addComponent(new AudioSource(new AudioClip("sounds/potionpickup.mp3")))
pickUpSound.addComponent(new Transform())
pickUpSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(pickUpSound)

const pourSound = new Entity()
pourSound.addComponent(new AudioSource(new AudioClip("sounds/pour.mp3")))
pourSound.addComponent(new Transform())
pourSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(pourSound)
// Potion
let potions = [];

function gamestart(){
  potionCount = 6
  milliSeconds=15
  for(let potion of potions) {
        potion.die();
      }
  potions = [];


  potions.push(new Potion(
    new GLTFShape("models/potion.glb"),
    new Transform({ 
      position: new Vector3(offset-2.2623,   GROUND_HEIGHT + 0.76945 , 10.568+offset ) 
    })
  ));
  potions.push(new Potion(
    new GLTFShape("models/potion2.glb"),
    new Transform({ 
      position: new Vector3(
        5.10232  + offset,
        1.02007 + GROUND_HEIGHT,
        -6.29982  + offset)
    })
  ));
  potions.push(new Potion(
    new GLTFShape("models/potion3.glb"),
    new Transform({ 
      position: new Vector3(
        -9.82075  + offset,
        0.8586 + GROUND_HEIGHT,
        -10.4827  + offset)
        
    })
  ));
  potions.push(new Potion(
    new GLTFShape("models/potion4.glb"),
    new Transform({ 
      position: new Vector3(
        6.97188 + offset,
        0.144858 + GROUND_HEIGHT,
        9.94071 + offset)
        
    })
  ));
  potions.push(new Potion(
    new GLTFShape("models/potion5.glb"),
    new Transform({ 
      position: new Vector3(
        9.74938  + offset,
        0 + GROUND_HEIGHT,
        -9.48479 + offset)
        
    })
  ));
  potions.push(new Potion(
    new GLTFShape("models/potion6.glb"),
    new Transform({ 
      position: new Vector3(
        -11.8356 + offset,
        0.192261 + GROUND_HEIGHT,
        11.5038 + offset)
      })
    ));

    // Potion controls
for(let potion of potions) {
  Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
    if(potion.dead){
      return;
    }
    let transform = potion.getComponent(Transform)
    let dist = distance(transform.position, Camera.instance.position)
      if (!potion.isGrabbed && isHolding==false && dist < 4) {
        potion.isGrabbed = true
        isHolding = true
        pickUpSound.getComponent(AudioSource).playOnce()

        // Calculates the potion's position relative to the camera
        transform.position = Vector3.Zero()
        transform.rotation = Quaternion.Zero()
        transform.position.z += Z_OFFSET
        transform.position.y += Y_OFFSET
        potion.setParent(Attachable.PLAYER)
      } else if (potion.isGrabbed) {
        if(distance(cauldren.getComponent(Transform).position, Camera.instance.position)<40){
          isHolding = false
          potion.die()
          pourSound.getComponent(AudioSource).playOnce()
          milliSeconds+=10
          potionCount--
        } else {
          potion.isGrabbed = false
          isHolding = false
          pickUpSound.getComponent(AudioSource).playOnce()

          // Calculate potion's ground position
          transform.position.y -= Y_OFFSET;
          potion.setParent(null) // Remove parent
          let forwardVector: Vector3 = Vector3.Forward().scale(Z_OFFSET).rotate(camera.rotation)
          transform.position = camera.position.clone().add(forwardVector)
          transform.lookAt(camera.position)
          transform.rotation = Quaternion.Zero()
          transform.position.y = GROUND_HEIGHT
        }
      }
  })
}
}

// Sign
const sign = new Sign(
  new GLTFShape("models/sign.glb"),
  new Transform({ 
    position: new Vector3(
      -2.8697 + offset,
      1.5 + GROUND_HEIGHT,
      0.3441 + offset)
  })
)


// Cauldren
const cauldren = new Cauldren(
  new GLTFShape("models/cauldren.glb"),
  new Transform({ 
    position: new Vector3(
      4.1528+ offset,
      0.7958 + GROUND_HEIGHT,
      -2.1019 + offset)
  })
)

// Level
const level = new Level(
  new GLTFShape("models/level.glb"),
  new Transform({ 
    position: new Vector3(15.9, GROUND_HEIGHT, 15.9) 
  })
)

// Sign controls

Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {

  let transform = sign.getComponent(Transform)
  let dist = distance(transform.position, Camera.instance.position)
  if(dist<15){
    gamestart();
  }
});


function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x
  const b = pos1.z - pos2.z
  return a * a + b * b
}
