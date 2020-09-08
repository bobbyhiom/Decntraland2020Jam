export class Level extends Entity {
    isGrabbed: boolean = false
    
    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)

       
    }
}