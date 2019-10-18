const Vue = require('../src/index.js')

window.app = new Vue({
    el: '#app',
    data: {
        a: {
            b: 1
        }
    },
    render(h) {
        console.log('render')
        return h('h1', {
            on: {
                click: () => {
                    this.a.b++
                    this.a.b++
                }
            }
        }, this.a.b)
    }
})
