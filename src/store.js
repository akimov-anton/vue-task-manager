import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';
import {INIT_DATA_URL} from '@/constants';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        todoList: []
    },

    actions: {
        addToList(store, payload) {
            if (Array.isArray(payload)) {
                payload.map(item => {
                    store.commit('addItem', item);
                });
            } else {
                store.commit('addItem', item);
            }
        },
        init(store, payload) {
            let localData = localStorage.getItem('todoList');
            if (localData) {
                return store.dispatch('addToList', JSON.parse(localData));
            } else {
                return axios.get(INIT_DATA_URL).then((response) => {
                    console.log(response.data);
                    if (response.data) {
                        localStorage.setItem('todoList', JSON.stringify(response.data));
                        return store.dispatch('addToList', response.data);
                    }
                });
            }
        }
    },
    mutations: {

        addItem(state, item) {
            state.todoList.push({
                ...item,
                date: `${(new Date()).toLocaleDateString()} ${(new Date()).toLocaleTimeString()}`
            });
        },
        swapItems(state, {id1, id2}) {
            let id1Index = state.todoList.findIndex(item => item.id === id1);
            let id2Index = state.todoList.findIndex(item => item.id === id2);

            let item1 = {...state.todoList[id1Index]};
            let item2 = {...state.todoList[id2Index]};

            Vue.set(state.todoList, id1Index, item2);
            Vue.set(state.todoList, id2Index, item1);
        }
    },
})
