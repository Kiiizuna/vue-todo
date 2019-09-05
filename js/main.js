(function() {
    new Vue({
        el: '#main',
        data: {
            list: [],
            current: {},
        },
        methods: {
            add: function() {
                var title = this.current.title
                if (!title || title === 0) {
                    return
                }
                var todo = Object.assign({}, this.current)
                this.list.push(todo)
                log('this.list:', this.list)
            },
            update: function() {

            },
            remove: function(id) {
                this.list.splice(id, 1)
            },
        }
    })
})()