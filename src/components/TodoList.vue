<template>
    <div class="todo-list" @mouseup="onMouseUp" @mousemove="onMouseMove">
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-toolbar color="blue" dark>
                        <v-toolbar-title>Task Manager</v-toolbar-title>
                    </v-toolbar>

                    <v-list
                            subheader
                            three-line
                    >
                        <v-list-tile>
                            <v-list-tile-content class="pt-4">
                                <v-layout row>
                                    <v-select
                                            :items="sortValues"
                                            v-model="currentSort"
                                            label="Sort"
                                    ></v-select>
                                    <v-select class="pl-5"
                                              :items="groupValues"
                                              v-model="currentGroup"
                                              label="Group"
                                    ></v-select>
                                </v-layout>

                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list
                            subheader
                            three-line
                            ref="list"
                            class="todo-list__list"
                            @mouseleave="movingItemId = null"
                    >
                        <div class="todo-list__item-wrapper"
                             v-for="item in sortedList"
                             :key="item.id"
                             @mouseover.stop="onMouseOver(item.id)">
                            <div class="todo-list__item"
                                 :ref="`item_${item.id}`"
                                 :class="{'todo-list__item--moving': item.id === movingItemId && isMoveMode}"
                            >
                                <v-list-tile @click="">
                                    <v-list-tile-action>
                                        <v-layout row>
                                            <v-flex md6>
                                                <div>{{item.id}}</div>
                                            </v-flex>
                                            <v-flex md6>
                                                <v-checkbox
                                                        v-model="item.completed"
                                                ></v-checkbox>
                                            </v-flex>

                                        </v-layout>

                                    </v-list-tile-action>

                                    <v-list-tile-content class="pl-4">
                                        <v-list-tile-title>{{item.title}}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{item.date}}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </div>
                        </div>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </div>

</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "TodoList",
        data() {
            return {
                movingItemId: null,
                isMoveMode: false,
                sortValues: ['name', 'date', 'status'],
                currentSort: 'date',
                currentGroup: 'all',
                groupValues: ['all', 'completed', 'remaining']
            }
        },
        computed: {
            ...mapState({
                todoList: 'todoList'
            }),
            movingItemPositionIndex() {
                if (this.movingItemId) {
                    return this.sortedList.findIndex(item => item.id === this.movingItemId);
                }
            },
            groupedList() {
                return this.todoList.filter(item => {
                    if (this.currentGroup === 'completed' && item.completed
                        || this.currentGroup === 'remaining' && !item.completed
                        || this.currentGroup === 'all') {
                        return true;
                    }
                });
            },
            sortedList() {
                if (this.currentSort === 'name') {
                    return this.groupedList
                        .sort((a, b) => {
                            if (a.title > b.title) {
                                return 1;
                            }
                            if (a.title < b.title) {
                                return -1;
                            }
                            return 0;
                        });
                }
                if (this.currentSort === 'date') {
                    return this.groupedList.sort((a, b) => {
                        return (new Date(a.date)).getTime() - (new Date(b.date)).getTime();
                    });
                }
                if (this.currentSort === 'status') {
                    return this.groupedList
                        .sort((a, b) => {
                            if (+a.completed > +b.completed) {
                                return 1;
                            }
                            if (+a.completed < +b.completed) {
                                return -1;
                            }
                            return 0;
                        });
                }

            }
        },
        methods: {
            ...mapMutations({
                swapItems: 'swapItems'
            }),
            getItemIdInSortedListByIndex(index) {
                return this.sortedList[index].id;
            },
            onMouseOver(id) {
                if (!this.isMoveMode) {
                    this.movingItemId = id;
                }
            },
            onMouseUp() {
                let el = this.$refs[`item_${this.movingItemId}`];
                if (el) {
                    el[0].style.top = '0px';
                }

                this.movingItemId = null;
                this.isMoveMode = false;

            },
            onMouseMove(e) {
                if (this.movingItemId && e.buttons === 1) {
                    this.isMoveMode = true;

                    let itemEl = this.$refs[`item_${this.movingItemId}`][0];
                    let listEl = this.$refs.list.$el;
                    let movingPositionTop = e.clientY + window.scrollY - listEl.offsetTop;
                    let newPositionIndex = parseInt(movingPositionTop / itemEl.offsetHeight);

                    itemEl.style.top = `${movingPositionTop}px`;

                    if (newPositionIndex !== this.movingItemPositionIndex) {
                        this.swapItems({
                            id1: this.movingItemId,
                            id2: this.getItemIdInSortedListByIndex(newPositionIndex)
                        });
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .todo-list {

        &__list {
            position: relative;
        }

        &__item-wrapper {
            height: 80px;
            margin-bottom: 10px;
            cursor: pointer;
            user-select: none;
        }
        &__item {

            &--moving {
                position: absolute;
                width: 100%;
                z-index: 10;
            }
        }
    }
</style>
