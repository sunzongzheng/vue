const Watcher = require('./Watcher.js')
const initState = require('./init-state.js')

function Vue(options) {
    this._init(options)
}

Vue.prototype._init = function (options) {

    this.$options = options

    initState(this)

    if (this.$options.el) {
        this.$mount(this.$options.el)
    }
}

function mountComponent(vm, el) {
    vm.$el = el

    const updateComponent = () => {
        vm._update(vm._render())
    }

    new Watcher(vm, updateComponent)
    return vm
}

Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)

    mountComponent(this, el)
}

Vue.prototype._render = function () {
    const h = require('snabbdom/h').default

    return this.$options.render.call(this, h)
}

Vue.prototype._update = function (vnode) {
    const patch = require('snabbdom').init([ // Init patch function with chosen modules
        require('snabbdom/modules/class').default, // makes it easy to toggle classes
        require('snabbdom/modules/props').default, // for setting properties on DOM elements
        require('snabbdom/modules/style').default, // handles styling on elements with support for animations
        require('snabbdom/modules/eventlisteners').default, // attaches event listeners
    ])

    if(this.$vnode) {
        patch(this.$vnode, vnode)
    } else {
        patch(this.$el, vnode)
    }
    this.$vnode = vnode
}

module.exports = Vue
