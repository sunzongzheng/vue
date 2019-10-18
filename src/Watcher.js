const {pushTarget, popTarget, isObject} = require('./util.js')
const nextTick = require('./next-tick.js')

let queue = []
const has = {}
let flushing = false
let waiting = false

function flushSchedulerQueue() {
    flushing = true

    queue.sort((a, b) => a.id - b.id)
    for (let index = 0; index < queue.length; index++) {
        const watcher = queue[index]
        watcher.run()
        has[watcher.id] = null
    }
    queue = []
    flushing = waiting = false
}

function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
        has[id] = true

        if (!flushing) {
            queue.push(watcher)
        }

        // 因为在下一个nextTick才会执行flushSchedulerQueue 所以用waiting来保证一次只有一个flushSchedulerQueue在执行
        if (!waiting) {
            waiting = true
            nextTick(flushSchedulerQueue)
        }
    }
}

let id = 0

class Watcher {
    constructor(vm, expOrFn, cb) {
        this.id = id++
        this.newDepIds = new Set()
        this.depIds = new Set()
        this.newDeps = []
        this.deps = []
        this.getter = expOrFn
        this.cb = cb
        this.vm = vm

        this.value = this.get()
    }

    get() {
        pushTarget(this)
        const value = this.getter.call(this, this)

        popTarget()
        this.cleanupDeps()

        return value
    }

    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    update() {
        queueWatcher(this)
    }

    run() {
        const value = this.get()
        const oldValue = this.value
        if (value !== oldValue || isObject(value)) {
            this.value = value
            this.cb.call(this.vm, value, oldValue)
        }
    }
}

module.exports = Watcher
