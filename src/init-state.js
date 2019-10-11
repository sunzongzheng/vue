const {observe} = require('./util.js')

function proxy(target, sourceKey, key) {
    const sharedPropertyDefinition = {
        enumerable: true,
        configurable: true
    }
    sharedPropertyDefinition.get = function () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function initData(vm) {
    const data = vm._data = vm.$options.data

    const keys = Object.keys(data)

    keys.forEach(key => {
        proxy(vm, `_data`, key)
    })

    observe(data)
}

function initState(vm) {
    const opts = vm.$options

    if (opts.data) {
        initData(vm)
    }
}

module.exports = initState
