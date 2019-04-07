<template>
    <v-app>
        <v-content>
            <TodoList/>
        </v-content>
    </v-app>
</template>

<script>
    import TodoList from '@/components/TodoList'

    export default {
        name: 'App',
        components: {
            TodoList
        },
        data() {
            return {

            }
        },
        created() {
            this.$store.dispatch('init');
        }
    }
</script>
