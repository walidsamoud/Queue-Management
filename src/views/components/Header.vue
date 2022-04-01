<template>
    <div id="LangindHeader">
        <a href="./" class="logo">
            <img 
                :src="Config.logo.header.url" 
                :alt="Config.name"
                :style="
                    'width: '+Config.logo.header.width
                    +';max-width: '+Config.logo.header.max_width
                    +';min-width: '+Config.logo.header.min_width
                "
            >
        </a>

        <div class="tabs" v-if="screen_width > Config.header.mobile_max_width" :dir="$i18n.locale=='ar'?'rtl':'ltr'">
            <a :href="item.url" class="tab" v-for="item in Config.header.items" :key="'header'+item.label.fr" v-show="item.status">
                <template v-if="$i18n.locale=='en'">{{item.label.en}}</template>
                <template v-else-if="$i18n.locale=='fr'">{{item.label.fr}}</template>
                <template v-else-if="$i18n.locale=='ar'">{{item.label.ar}}</template>
                <template v-else>{{item.label.defaut}}</template>
            </a>
            <a class="tab login" @click="login" v-if="!user && Config.header.login.status">
                <template v-if="$i18n.locale=='en'">{{Config.header.login.logged_out_label.en}}</template>
                <template v-else-if="$i18n.locale=='fr'">{{Config.header.login.logged_out_label.fr}}</template>
                <template v-else-if="$i18n.locale=='ar'">{{Config.header.login.logged_out_label.ar}}</template>
                <template v-else>{{Config.header.login.logged_out_label.defaut}}</template>
            </a>
            <a class="tab login" @click="myAccount" v-else-if="Config.header.login.status">
                <template v-if="$i18n.locale=='en'">{{Config.header.login.logged_in_label.en}}</template>
                <template v-else-if="$i18n.locale=='fr'">{{Config.header.login.logged_in_label.fr}}</template>
                <template v-else-if="$i18n.locale=='ar'">{{Config.header.login.logged_in_label.ar}}</template>
                <template v-else>{{Config.header.login.logged_in_label.defaut}}</template>
                <font-awesome-icon class="icon" icon="caret-down" /> 
            </a>
        </div>

        <div class="tabs mobile" v-else>
            <font-awesome-icon class="icon" icon="bars" @click="openSideMenu()"/> 
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default({
    data:()=>({
        user: null,
        screen_width: null
    }),
    methods:{
        pageResized(){
            this.screen_width = $(window).width()
        },
        login(){
            this.$emit('login')
        },
        myAccount(){
            this.$emit('openProfile')
        },
        openSideMenu(){
            this.$emit('openSideMenu')
        }
    },
    mounted(){
        this.user = JSON.parse( localStorage.getItem('user') )
        this.screen_width = $(window).width()
    },
    created(){
        window.addEventListener("resize", this.pageResized);
    }
})
</script>

<style lang="scss" scoped>
    #LangindHeader{
        display: flex;
        justify-content: space-between;
        padding: 10px 2vw;
        background: #fff;
        z-index: 99999;
        position: fixed;
        width: 100vw;
        .logo{
            img{
                // width: 100%;
                // max-width: 500px;
                // min-width: 300px;
            }
        }
        .tabs{
            margin-top: 15px;
            .tab{
                padding: 0 20px;
                font-size: 15px;
                color: var(--primary);
                letter-spacing: 1px;
                cursor: pointer;
                font-weight: bold;
            }
            .tab:hover{
                color: var(--primary-hover);
            }
            .login{
                border: 2px solid var(--secondary);
                border-radius: 50px;
                color: var(--secondary);
                padding: 10px 60px;
                transition: .3s;
            }
            .login:hover{
                background: var(--secondary);
                color: var(--secondary-font);
            }
        }
        .mobile{
            padding: 0 10px 0 60px;
            .icon{
                font-size: 26px;
                color: var(--primary);
                transition: .3s;
                margin-top: -10px;
            }
            .icon:hover{
                color: var(--primary-hover);
                transform: scale(1.05);
            }
        }
    }
</style>