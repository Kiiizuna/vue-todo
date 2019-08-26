(function() {
    window.ms = {
        set: set,
        get: get,
    }


    function set(key, val) {
        var v = JSON.stringify(val)
        localStorage.setItem(key, v)
    }

    function get(key) {
        var json = localStorage.getItem(key)
        if(json) {
            return JSON.parse(json)
        }
    }
})()


var log = function() {
    console.log.apply(console, arguments)
}


