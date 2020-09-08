export class Sign extends Entity {


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
                hoverText: "Play/Reset Game",
                distance: 3
            }
        ))
    }
}