<template>
    <div id="LangindHome" :style="screen_width <= Config.footer.mobile_max_width?'justify-content: center !important;':''">
        <div class="right" v-if="Config.footer.copyright.status">
            <template v-if="$i18n.locale=='en'">{{Config.footer.copyright.text.en}}</template>
            <template v-else-if="$i18n.locale=='fr'">{{Config.footer.copyright.text.fr}}</template>
            <template v-else-if="$i18n.locale=='ar'">{{Config.footer.copyright.text.ar}}</template>
            <template v-else>{{Config.footer.copyright.text.default}}</template>
            <a href="https://liberrex.com/" class="liberrex">
                <img 
                    :src="Config.footer.copyright.logo.url" 
                    alt="Liberrex"
                    :style="'height: '+Config.footer.copyright.logo.height+'; width: '+Config.footer.copyright.logo.width"
                >
            </a>
        </div>
        <div class="empty_div_just_to_be_used_for_display_flex_and_justify_content_space_between" v-else></div>
        <div class="left" v-if="screen_width > Config.footer.mobile_max_width">
            <div class="language" v-if="Config.footer.terms.status">
                <a :href="Config.footer.terms.url" target="_blank">{{$t('Privacy')}}</a>
            </div>
            <div class="language" v-if="Config.footer.policy.status">
                <a :href="Config.footer.policy.url" target="_blank">{{$t('Terms')}}</a>
            </div>
            <div class="language" @click="show_all_languages = !show_all_languages" v-if="Config.footer.language_selector">
                <div v-if="language=='en'">
                    <img src="/en.png" alt="">
                    <span>English</span>
                    <font-awesome-icon class="icon ml-2" icon="caret-up" /> 
                </div>
                <div v-else-if="language=='fr'">
                    <img src="/fr.png" alt="">
                    <span>Français</span>
                    <font-awesome-icon class="icon ml-2" icon="caret-up" /> 
                </div>
                <div v-else>
                    <img src="/tn.png" alt="">
                    <span>العربية</span>
                    <font-awesome-icon class="icon ml-2" icon="caret-up" /> 
                </div>
            </div>
            <div class="all_languages" v-show="Config.footer.language_selector && show_all_languages">
                <div @click="changeLanguage('en')">
                    <img src="/en.png" alt="">
                    <span>English</span>
                </div>
                <div @click="changeLanguage('fr')">
                    <img src="/fr.png" alt="">
                    <span>Français</span>
                </div>
                <div @click="changeLanguage('ar')">
                    <img src="/tn.png" alt="">
                    <span style="letter-spacing: 0;">العربية</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default({
    data:()=>({
        screen_width: null,
        language: localStorage.getItem('Language'),
        show_all_languages: false
    }),
    methods:{
        pageResized(){
            this.screen_width = $(window).width()
        },
        changeLanguage(language){
            localStorage.setItem('Language', language)
            this.$router.go()
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
    #LangindHome{
        display: flex;
        justify-content: space-between;
        padding: 0 7vw;
        position: fixed;
        bottom: 0;
        padding: 10px 30px;
        width: 100%;
        background: var(--primary);
        color: var(--primary-font);
        z-index: 99999;
        position: fixed;
        width: 100vw;
        .left{
            display: flex;
            justify-content: right;
            .language{
                margin-left: 40px;
                cursor: pointer;
                img{
                    height: 12px;
                    width: 20px;
                    margin-top: -5px;
                    border-radius: 2px;
                }
                span, a{
                    font-size: 13px;
                    padding-left: 10px;
                    letter-spacing: 1px;
                    color: var(--primary-font);
                }
            }
            // .language:hover ~ .all_languages{
            //     display: block;
            // }
            // .all_languages:hover{
            //     display: block;
            // }
            .all_languages{
                position: absolute;
                bottom: 40px;
                // padding: 10px;
                box-shadow: 0 0 1px 1px #ccc;
                background: #fff;
                cursor: pointer;
                transition: .3s;
                // display: none;
                div{
                    padding: 10px 15px;
                    img{
                        height: 12px;
                        width: 20px;
                        margin-top: -5px;
                        border-radius: 2px;
                    }
                    span, a{
                        font-size: 13px;
                        padding-left: 10px;
                        letter-spacing: 1px;
                        color: #333;
                    }
                }
                div:hover{
                    background: var(--primary);
                    span, a{
                        color: var(--primary-font) !important;
                    }
                }
            }
        }
        .right{
            font-size: 13px;
            .liberrex{
                img{
                    margin-top: -2px;
                    margin-left: 20px;
                    letter-spacing: 1px;
                }
            }
        }
    }
</style>