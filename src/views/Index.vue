<template>
    <div id="LandingCheckIn">
        <Header 
            @login="login" 
            @openSideMenu="openSideMenu"
            @openProfile="openProfile"
            :style="header_border?'border-bottom: 1px solid #ddd;padding-bottom: '+Config.options.padding_bottom_for_header:''"
        />
        <SideMenu 
            ref="SideMenu" 
            @login="login" 
            @openProfile="openProfile"
        />
        <Home 
            @openMap="openMap" 
            @openVendor="openVendor" 
            :style="'padding-top: '+Config.options.padding_top_for_home_section+' !important;padding-bottom: '+Config.options.padding_bottom_for_home_section+' !important;'"
        />
        <Footer />

        <Agencies 
            v-if="!is_mobile && Config.is_organization" 
            ref="Agencies" 
            @openVendor="openVendor" 
            @backHome="backHome" 
            @removeBorder="removeBorder"
            :style="'padding-top: '+Config.options.padding_top_for_agencies_section+' !important;padding-bottom: '+Config.options.padding_bottom_for_agencies_section+' !important;'"

        />
        <AgenciesMobile 
            v-else-if="Config.is_organization"
            ref="Agencies" 
            @openVendor="openVendor" 
            @removeBorder="removeBorder"
            @backHome="backHome"
            :style="'padding-top: '+Config.options.padding_top_for_agencies_section+' !important;padding-bottom: '+Config.options.padding_bottom_for_agencies_section+' !important;'"
        />

        <Vendor 
            v-if="!is_mobile" 
            ref="Agency" 
            @login="login" 
            @pinMapTo="pinMapTo"  
            @removeBorder="removeBorder"
            :style="'padding-top: '+Config.options.padding_top_for_vendor_section+' !important;padding-bottom: '+Config.options.padding_bottom_for_vendor_section+' !important;'"
        />
        <VendorMobile
            v-else
            ref="Agency" 
            @login="login" 
            @pinMapTo="pinMapTo"  
            @removeBorder="removeBorder"
            :style="'padding-top: '+Config.options.padding_top_for_vendor_section+' !important;padding-bottom: '+Config.options.padding_bottom_for_vendor_section+' !important;'"
        />

        <Login ref="LoginModal"/>
        <Profile 
            ref="Profile" 
            :style="'padding-top: '+Config.options.padding_top_for_profil_section+' !important;padding-bottom: '+Config.options.padding_bottom_for_profil_section+' !important;'"
        />
    </div>
</template>

<script>
import $ from 'jquery'

import Header from './components/Header.vue'
import SideMenu from './components/SideMenu.vue'
import Profile from './Profile.vue'
import Home from './Home.vue'
import Footer from './components/Footer.vue'

import Agencies from './Agencies.vue'
import AgenciesMobile from './AgenciesMobile.vue'

import Vendor from './vendor/Index.vue'
import VendorMobile from './vendorMobile/Index.vue'

import Login from './auth/Login.vue'

export default({
    data:()=>({
        query_vendor_hid: null,
        screen_width: null,
        is_mobile: false,
        header_border: false
    }),
    components:{
        Header,
        Home,
        Footer,

        Agencies,
        AgenciesMobile,

        Vendor,
        VendorMobile,

        Login,
        SideMenu,
        Profile
    },
    mounted(){
        if(this.$route.query.hid || this.$route.params.short_code){
            $('#PreLoader').show()
            setTimeout(function(){
                this.openVendorFromUrl()
            }.bind(this), 300)
        }
        this.pageResized()
    },
    created(){
        window.addEventListener("resize", this.pageResized);
    },
    methods:{
        openProfile(){
            this.$refs.Profile.show()
        },
        openSideMenu(){
            this.$refs.SideMenu.show()
        },
        removeBorder(){
            this.header_border = false
        },
        pinMapTo(id, position){
            if(!this.is_mobile){
                this.$refs.Agencies.pinMapTo(id, position)
            }
        },
        openVendorFromUrl(){
            if(this.$route.query.hid){
                this.query_vendor_hid = this.$route.query.hid
                if(this.$refs.Agencies){
                    this.$refs.Agencies.show()
                }
                this.$refs.Agency.show(this.query_vendor_hid, true)
                this.header_border = true
            }else if(this.$route.params.short_code){
                this.query_vendor_hid = this.$route.params.short_code
                if(this.$refs.Agencies){
                    this.$refs.Agencies.show()
                }
                this.$refs.Agency.showByShortCode(this.query_vendor_hid, true)
                this.header_border = true
            }
            $('#PreLoader').hide()
        },
        pageResized(){
            this.screen_width = $(window).width()
            if(this.screen_width > this.Config.home.mobile_max_width){
                this.is_mobile = false
            }else{
                this.is_mobile = true
            }
        },
        login(){
            this.$refs.LoginModal.show()
        },
        backHome(){
            this.$refs.Agency.hide()
            this.header_border = false
        },
        openVendor(short_code){
            this.$refs.Agency.showByShortCode(short_code)
            this.header_border = true
        },
        openMap(){
            this.$refs.Agencies.show()
            this.header_border = true
        },
        showLoading(){
            this.$vs.loading({
                container: '#checkin-box',
                scale: 0.6
            });
        },
        hideLoading(){
            this.$vs.loading.close('#checkin-box > .con-vs-loading')
        }
    }
})
</script>

<style lang="scss" scoped>
    #LandingCheckIn{
        overflow: hidden !important;
        height: 100vh !important;
        position: relative !important;
    }
</style>