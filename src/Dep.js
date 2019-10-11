let id = 0

class Dep {
    constructor(props) {
        this.id = id++
        this.subs = []
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if(index > -1) {
            this.subs.splice(index, 1)
        }
    }

    notify() {
        this.subs.forEach(sub => sub.update())
    }
}

Dep.target = null

module.exports = Dep
