const w = window.innerWidth,h = window.innerHeight
const n = 20
class ExplosionComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.explosionContainer = new ExplosionContainer(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.explosionContainer.drawExplosions(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event)=>{
            const x = event.offsetX
            const y = event.offsetY
            this.explosionContainer.createExploision(x,y)
        }
    }
}
class Explosion {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.maxR = Math.min(w,h)/16
        this.r = 0
    }
    draw(context) {
        context.save()
        context.globalAlpha = 1-(this.r/this.maxR)
        context.translate(this.x,this.y)
        var gapDeg = 360/n,deg = gapDeg
        context.fillStyle = '#d32f2f'
        for(var i = 0;i<n;i++) {
            const x = this.r*Math.cos(deg*Math.PI/180),y = this.r*Math.sin(deg*Math.PI/180)
            context.beginPath()
            context.arc(x,y,2,0,2*Math.PI)
            context.fill()
            deg += gapDeg
        }
        context.restore()
    }
    update() {
        this.r += this.maxR/15
    }
    stopped() {
        return this.r > this.maxR
    }
}
class ExplosionContainer {
    constructor(component) {
        this.component = component
        this.explosions = []
    }
    createExploision(x,y) {
        this.explosions.push(new Explosion(x,y))
        if(this.explosions.length == 1) {
            this.startUpdatingExplosions()
        }
    }
    drawExplosions(context) {
        this.explosions.forEach((explosion)=>{
            explosion.draw(context)
        })
    }
    startUpdatingExplosions() {
        const interval = setInterval(()=>{
            this.component.render()
            this.explosions.forEach((explosion,index)=>{
                explosion.update()
                if(explosion.stopped()) {
                    this.explosions.splice(index,1)
                    if(this.explosions.length == 0) {
                        clearInterval(interval)
                    }
                }
            })
        },10)
    }
}
customElements.define('explosion-comp',ExplosionComponent)
