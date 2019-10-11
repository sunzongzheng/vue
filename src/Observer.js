const Dep = require('./Dep.js')
const {observe} = require('./util.js')

function defineReactive(obj, key, val) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    const getter = property.get
    const setter = property.set

    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }
    observe(val)

    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
            }
            return value
        },
        set(newVal) {
            const value = getter ? getter.call(obj) : val
            if(newVal === value) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            // 新设置的值也要是一个响应式对象
            observe(newVal)
            dep.notify()
        }
    })
}

class Observer {
    constructor(value) {
        this.value = value
        this.dep = new Dep()

        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })

        if (Array.isArray(value)) {
            value.forEach(item => observe(item))
        } else {
            const keys = Object.keys(value)
            for (let i = 0; i < keys.length; i++) {
                defineReactive(value, keys[i])
            }
        }
    }

}

module.exports = Observer
