const w = window.innerWidth,h = window.innerHeight
class ExplosionComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('canvas')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,w,h)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
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
        context.translate(this.x,this.y)
        var deg = 3.6
        context.fillStyle = '#d32f2f'
        for(var i = 0;i<100;i++) {
            const x = this.r*Math.cos(deg*Math.PI/180),y = this.r*Math.sin(deg*Math.PI/180)
            context.beginPath()
            context.arc(x,y,r,0,2*Math.PI)
            context.fill()
            deg += 3.6
        }
        context.restore()
    }
    update() {
        this.r += this.maxR/10
    }
    stopped() {
        return this.r > this.maxR
    }
}
