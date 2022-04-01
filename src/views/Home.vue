<template>
    <div 
        id="LangindHome" 
        class="row"
    >
        <div class="left col-md-6">
            <div class="image">
                <img :src="Config.home.image" alt="">
            </div>

            <div class="titles">
                <div class="title title1">
                    <template v-if="$i18n.locale=='en'">{{Config.home.title1.en}}</template>
                    <template v-else-if="$i18n.locale=='fr'">{{Config.home.title1.fr}}</template>
                    <template v-else-if="$i18n.locale=='ar'">{{Config.home.title1.ar}}</template>
                    <template v-else>{{Config.home.title1.default}}</template>
                </div>
                <div class="title title2">
                    <template v-if="$i18n.locale=='en'">{{Config.home.title2.en}}</template>
                    <template v-else-if="$i18n.locale=='fr'">{{Config.home.title2.fr}}</template>
                    <template v-else-if="$i18n.locale=='ar'">{{Config.home.title2.ar}}</template>
                    <template v-else>{{Config.home.title2.default}}</template>
                </div>
            </div>

            <div class="text" v-if="$i18n.locale=='en'" v-html="Config.home.text.en"></div>
            <div class="text" v-else-if="$i18n.locale=='fr'" v-html="Config.home.text.fr"></div>
            <div class="text" v-else-if="$i18n.locale=='ar'" v-html="Config.home.text.ar"></div>
            <div class="text" v-else v-html="Config.home.text.default"></div>

            <div class="button">
                <button 
                    class="btn btn-primary" 
                    @click="openMap()" 
                    :style="screen_width <= Config.home.mobile_max_width?'width: 100%;':''"
                    v-if="Config.is_organization"
                >
                    <span v-if="$i18n.locale=='en'">{{Config.home.button_text.en}}</span>
                    <span v-else-if="$i18n.locale=='fr'">{{Config.home.button_text.fr}}</span>
                    <span v-else-if="$i18n.locale=='ar'">{{Config.home.button_text.ar}}</span>
                    <span v-else>{{Config.home.button_text.default}}</span>
                    
                    <span v-if="$i18n.locale=='en'"> {{Config.options.how_to_spell_agency.en}}</span>
                    <span v-else-if="$i18n.locale=='fr'"> {{Config.options.how_to_spell_agency.fr}}</span>
                    <span v-else-if="$i18n.locale=='ar'"> {{Config.options.how_to_spell_agency.ar}}</span>
                    <span v-else> {{Config.options.how_to_spell_agency.default}}</span>

                    <font-awesome-icon class="icon" icon="chevron-right" />
                </button>
                <button 
                    class="btn btn-primary" 
                    @click="openVendor(Config.default_business_short_code)" 
                    :style="screen_width <= Config.home.mobile_max_width?'width: 100%;':''"
                    v-else
                >
                    <span v-if="$i18n.locale=='en'">{{Config.home.button_text.en}}</span>
                    <span v-else-if="$i18n.locale=='fr'">{{Config.home.button_text.fr}}</span>
                    <span v-else-if="$i18n.locale=='ar'">{{Config.home.button_text.ar}}</span>
                    <span v-else>{{Config.home.button_text.default}}</span>

                    <font-awesome-icon class="icon" icon="chevron-right" />
                </button>
            </div>
        </div>
        <div 
            class="right col-md-6"
            :style="screen_width <= Config.home.mobile_max_width?'text-align: center !important;':''"
        >
            <img :src="Config.home.image" alt="">
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default({
    data:()=>({
        screen_width: null
    }),
    components:{},
    methods:{
        pageResized(){
            this.screen_width = $(window).width()
        },
        openMap(){
            this.$emit('openMap')
        },
        openVendor(vendor_hid){
            this.$emit('openVendor', vendor_hid)
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
        padding: 5vw 7vw;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        position: relative;
        height: 100%;
        .left{
            .image{
                margin-top: -40px !important;
                text-align: center;
                width: 100%;
                margin-top: -30px;
                display: none;
                img{
                    width: 25vh;
                    // min-width: 200px !important;
                }
            }
            .titles{
                margin-top: 20px;
                .title{
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .title1{
                    font-size: 4vw;
                    color: var(--primary);
                }
                .title2{
                    font-size: 5vw;
                    color: var(--secondary);
                }
            }
            .text{
                color: #555;
                margin-top: 20px;
                letter-spacing: 1px;
                font-size: 17px;
            }
            .button{
                margin-top: 40px;
                button{
                    background: var(--primary);
                    color: var(--primary-font);
                    border-radius: 100px;
                    height: 50px;
                    font-size: 17px;
                    padding: 10px 40px;
                    transition: .3s;
                    outline: none;
                    .icon{
                        font-size: 12px;
                        margin-left: 10px;
                    }
                }
                button:hover{
                    background: var(--primary-hover);
                    border-color: var(--primary);
                }
            }
        }
        .right{
            text-align: right;
            width: 100%;
            img{
                width: 35vw;
                min-width: 40vh;
            }
        }
    }

    @media only screen and (max-width: 800px) {
        .left{
            .title1{
                font-size: 30px !important;
            }
            .title2{
                font-size: 40px !important;
            }
            .text{
                font-size: 13px !important;
            }
        }
        .image{
            display: block !important;
        }
        .right{
            display: none;
            img{
                min-width: 250px !important;
            }
        }
    }
</style>