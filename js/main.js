(function() {
    'use strict';

    var copy = function(obj) {
        return Object.assign({}, obj)
    }

    var Event = new Vue()
    //事件中心


    var sound_alert = document.querySelector('#sound-alert')
    Vue.component('task', {
        template:'#task-tpl',
        props:['todo'],
        methods: {
            action: function(name, params) {
                Event.$emit(name, params)
            }
        },
    })

    new Vue({
        el: '#main',
        data: {
            list: [],
            current: {},
            last_id: 0,
        },
        mounted: function() {

            var me = this

            this.list = ms.get('list') || this.list
            this.last_id = ms.get('last_id') || this.last_id

            this.check_alerts()

            setInterval(function() {
                me.check_alerts()
            })

            Event.$on('remove', function (params) {
                log('params', params)
                if (params) {
                    me.remove(params)
                }
            })
            Event.$on('toggle_complete', function (params) {
                log('params', params)
                if (params) {
                    me.toggle_complete(params)
                }
            })
            Event.$on('set_current', function (params) {
                log('params', params)
                if (params) {
                    me.set_current(params)
                }
            })
            Event.$on('toggle_detail', function (params) {
                log('params', params)
                if (params) {
                    me.toggle_detail(params)
                }
            })
        },

        methods: {

            check_alerts: function() {
                var me = this
                this.list.forEach(function (row, i) {
                    var alert_at = row.alert_at
                    if (!alert_at || row.alert_confirmed) return
                    // 如果没有 alert_at 就直接返回, 用户觉得这个 todo 是不需要 alert 的
                    log('alert_at', alert_at)
                    var alert_at = (new Date(alert_at)).getTime()
                    var now = (new Date()).getTime()
                    log('now', now)
                    if (now >= alert_at) {
                        sound_alert.play()
                        var confirmed = confirm(row.title)
                        Vue.set(me.list[i], 'alert_confirmed', confirmed)
                    }
                })
                // correct way
                // var me = this;
                // this.list.forEach(function (row, i) {
                //     var alert_at = row.alert_at;
                //     if (!alert_at || row.alert_confirmed) return;
        
                //     var alert_at = (new Date(alert_at)).getTime();
                //     var now = (new Date()).getTime();
        
                //     if (now >= alert_at) {
                //     alert_sound.play();
                //     var confirmed = confirm(row.title);
                //     Vue.set(me.list[i], 'alert_confirmed', confirmed);
                //     }
                // })
            },

            merge: function() {
                var is_update, id
                is_update = id = this.current.id
                log('id is', id)
                if (is_update) {
                //     var index = this.list.findIndex(function(item) {
                //         log('item.id is', item.id)
                //         return item.id == is_update
                // })
                    var index = this.find_index(id)
                    // var index = this.find_index(id)
                    log('revise index is', index)
                    // revise index 是 list 数组中的排序的 index
                    Vue.set(this.list, index, copy(this.current))
                    // this.list[index] = copy(this.current)
                    // log('list', this.list)
                } else {
                    // 添加新的 todo 
                    var title = this.current.title
                    if (!title || title === 0) {
                        return
                    }
                    var todo = copy(this.current)
                    this.last_id++
                    ms.set('last_id', this.last_id)
                    todo.id = this.last_id
                    this.list.push(todo)                   
                }
                // 在添加后存入 localStorage
                // ms.set('list', this.list)
                this.reset_current() 
                log('this.list is:', this.list)
                
            },

            remove: function(id) {
                var index = this.find_index(id)
                this.list.splice(index, 1)
                // 在删除后存入 localStorage
                // ms.set('list', this.list)
            },
            next_id: function() {
                return this.list.length + 1
            },
            set_current: function(todo) {
               this.current = copy(todo)
            },
            reset_current: function() {
                this.set_current({})
            },
            find_index: function(id) {
                return this.list.findIndex(function(item) {
                    return item.id == id    
                })
            },
            toggle_complete: function(id) {
                var index = this.find_index(id)
                log('completed', this.list[index].completed)
                Vue.set(this.list[index], 'completed', !this.list[index].completed)
                
            },
            toggle_detail: function(id) {
                var index = this.find_index(id)
                // this.list[index].show_detail
                // log('this.list[index].show_detail is', this.list[index].show_detail)
                Vue.set(this.list[index], 'show_detail',!this.list[index].show_detail)
            },
        },

        // 监控 list 自动更新 localStorage
        watch: {
            list: {
                deep: true, // 不管嵌套有多深
                handler: function(new_ele, old_ele) {
                    if (new_ele) {
                        ms.set('list',new_ele)
                    } else {
                        ms.set('list', [])
                    }
                }
            }
        },


    })
})()




