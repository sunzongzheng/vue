const {pushTarget, popTarget, isObject} = require('./util.js')

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
        // TODO 加入到队列 nextTick时批量更新
        this.run()
    }

    run() {
        const value = this.get()
        const oldValue = this.value
        if(value !== oldValue || isObject(value)) {
            this.value = value
            this.cb.call(this.vm, value, oldValue)
        }
    }
}

module.exports = Watcher
