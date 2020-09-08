export class Potion extends Entity {
    isGrabbed: boolean = false
    pointerComponent: OnPointerDown
    entity: Potion 
    dead: boolean = false

    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)

        this.entity = this;

        this.pointerComponent =
            new OnPointerDown(
                ()=> {
                    // Do Nothing
                },
                {
                    button: ActionButton.PRIMARY,
                    hoverText: "Pick Up / Put Down",
                    distance: 10
                }
            )

        this.addComponent(this.pointerComponent)
    }

    die(){
        engine.removeEntity(this)
        this.dead = true
    }
}

function distance(pos1: Vector3, pos2: Vector3): number {
    const a = pos1.x - pos2.x
    const b = pos1.z - pos2.z
    return a * a + b * b
  }
  