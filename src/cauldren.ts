export class Cauldren extends Entity {
    
    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)


    this.addComponent( new OnPointerDown(
        ()=> {
            
        },
        {
            button: ActionButton.PRIMARY,
            hoverText: "Add to cauldron",
            distance: 3
        }
    ))
       
    }
}
