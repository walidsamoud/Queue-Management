<template>
    <div id="SideMenu">
        <div class="overlay" @click="hide()"></div>
        <div id="mySidenav" class="sidenav">
            <a :href="item.url" v-for="item in Config.header.items" :key="'header2'+item.label.fr" v-show="item.status">
                
                <template v-if="$i18n.locale=='en'">{{item.label.en}}</template>
                <template v-else-if="$i18n.locale=='fr'">{{item.label.fr}}</template>
                <template v-else-if="$i18n.locale=='ar'">{{item.label.ar}}</template>
                <template v-else>{{item.label.defaut}}</template>
            </a>

            <a :href="Config.footer.terms.url" target="_blank" v-if="Config.footer.terms.status">
                {{$t('Terms')}}
            </a>

            <a :href="Config.footer.policy.url" target="_blank" v-if="Config.footer.policy.status">
                {{$t('Privacy')}}
            </a>
            
            <a @click="login" v-if="!user && Config.header.login.status">
                <template v-if="$i18n.locale=='en'">{{Config.header.login.logged_out_label.en}}</template>
                <template v-else-if="$i18n.locale=='fr'">{{Config.header.login.logged_out_label.fr}}</template>
                <template v-else-if="$i18n.locale=='ar'">{{Config.header.login.logged_out_label.ar}}</template>
                <template v-else>{{Config.header.login.logged_out_label.defaut}}</template>
            </a>
            <a @click="myAccount" v-if="user">
                <template v-if="$i18n.locale=='en'">{{Config.header.login.logged_in_label.en}}</template>
                <template v-else-if="$i18n.locale=='fr'">{{Config.header.login.logged_in_label.fr}}</template>
                <template v-else-if="$i18n.locale=='ar'">{{Config.header.login.logged_in_label.ar}}</template>
                <template v-else>{{Config.header.login.logged_in_label.defaut}}</template>
            </a>
            <a class="logout" @click="logout" v-if="user">
                {{$t('Kiosk.App.LogoutButton')}}
            </a>
            <a href="javascript:void(0)" class="closebtn" @click="hide()">&times;</a>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default({
    data:()=>({
        user: null,
    }),
    mounted(){
        this.user = JSON.parse( localStorage.getItem('user') )
    },
    methods:{
        show() {
            $('#mySidenav').css('right', 0)
            $('#SideMenu > .overlay').fadeIn()
        },
        hide() {
            $('#mySidenav').css('right', '-250px')
            $('#SideMenu > .overlay').fadeOut()
        },
        login(){
            this.hide()
            this.$emit('login')
        },
        logout(){
            localStorage.removeItem('user')
            window.location.href = ''
        },
        myAccount(){
            this.hide()
            this.$emit('openProfile')
        },
    }
})
</script>


<style lang="scss" scoped>
    #SideMenu{
        margin: 0;
        padding: 0;
        .overlay{
            display: none;
            z-index: 999990;
            background: rgba(0, 0, 0, 0.5);
            height: 100vh; min-height: -webkit-fill-available;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            cursor: pointer;
        }
        .sidenav {
            height: 100%;
            width: 250px;
            position: fixed;
            z-index: 999999;
            top: 0;
            right: -250px;
            background-color: #fff;
            overflow-x: hidden;
            transition: 0.3s;
            padding-top: 20px;
            text-align:left;
        }

        .sidenav a {
            padding: 8px 8px 8px 10px;
            margin-left: 30px;
            margin-top: 17px;
            text-decoration: none;
            font-size: 15px;
            color: var(--special-font);
            border-bottom: 1px solid #ccc;
            display: block;
            transition: 0.3s;
            font-weight: 600;
            .icon{
                margin-right: 10px;
            }
        }
        .sidenav .logout{
            color: var(--danger);
            border-bottom: 1px solid var(--danger);
        }

        .sidenav a:hover{
            // color: var(--primary-font);
            // background: var(--primary);
        }

        .sidenav .closebtn {
            position: absolute;
            bottom: 0;
            right: 25px;
            font-size: 36px;
            margin-left: 50px;
            margin-bottom: 10px;
            text-align: center;
            padding: 0 10px;
            border-radius: 5px;
        }

        @media screen and (max-height: 450px) {
            .sidenav {padding-top: 15px;}
            .sidenav a {font-size: 18px;}
        }
    }
</style>