function nextTick(fn) {
    Promise.resolve().then(fn)
}

module.exports = nextTick
