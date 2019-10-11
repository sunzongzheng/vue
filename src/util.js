const Dep = require('./Dep.js')

function isObject(value) {
    return value !== null && typeof value === 'object'
}

function observe(value) {
    if (!isObject(value)) return
    const Observer = require('./Observer.js')

    return new Observer(value)
}

const targetStack = []

function pushTarget (target) {
    Dep.target = target
    targetStack.push(target)
}

function popTarget() {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}

function queueWatcher(watcher) {
    const id = watcher.id
}

exports.isObject = isObject
exports.observe = observe
exports.pushTarget = pushTarget
exports.popTarget = popTarget
exports.queueWatcher = queueWatcher
