<template>
    <div id="LangindAgenciesMobile">
        <div class="window_closer" @click="hide()">
            <font-awesome-icon class="icon" icon="arrow-right" /> 
        </div>
        <div class="right" v-if="loading">
            <div class="section-loader">
                <img src="/loader-circle.gif" alt="">
                <span>{{$t('Loading')}}</span>
            </div>
        </div>
        <div class="right" v-else>
            <div class="recommendation" v-if="recommended_vendor">
                <div class="subtitle">
                    - {{$t('Recommended')}}
                </div>

                <div class="p-2" @click="openVendor(recommended_vendor.shortcode)">
                    <Agency :Recommended="true" :Vendor="recommended_vendor"/>
                </div>
            </div>

            <div class="vendors" v-if="vendors && vendors.length">
                <div class="subtitle">
                    - {{$t('YouCanAlsoFind')}}
                </div>

                <div class="p-2" v-for="item in vendors" :key="item.id" @click="openVendor(item.shortcode)">
                    <Agency :Recommended="false" :Vendor="item"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import Agency from './components/Agency.vue'
import {vendorsService} from '/src/_services'

import GmapCluster from 'vue2-google-maps/dist/components/cluster';

export default({
    data:()=>({
        loading: true,
        loading_map: true,
        position: {
            lat: 36,
            lng: 10
        },
        position_is_correct: false,
        filter: {
            search_keyword: null,
            page: 1
        },

        vendors: null,
        recommended_vendor: null,
        markers: [],
        opened_info_window: 0
    }),
    components:{
        Agency,
        GmapCluster
    },
    mounted(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                this.position.lat = position.coords.latitude
                this.position.lng = position.coords.longitude
                this.position_is_correct = true
                this.initPage();
            }.bind(this));
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    methods:{
        openVendor(short_code){
            this.$emit('openVendor', short_code)
        },
        initPage(){
            vendorsService.filter(
                {
                    organization: this.Config.organization_id, 
                    lat: this.position.lat, 
                    lng: this.position.lng, 
                    keyword: this.filter.search_keyword,
                    radius: this.Config.options.agencies_filter_radius,
                }, 
                this.filter.page
            ).then(function(data){
                this.vendors = data.data.data.map((obj)=>{
                    
                    if(!obj.shortest_waiting_time || obj.shortest_waiting_time == 0){
                        obj.iconImgNumber = 0
                    }else if(obj.shortest_waiting_time <= this.Config.queue_status_icons.show_1_person_until){
                        obj.iconImgNumber = 1
                    }else if(obj.shortest_waiting_time <= this.Config.queue_status_icons.show_2_persons_until){
                        obj.iconImgNumber = 2
                    }else if(obj.shortest_waiting_time <= this.Config.queue_status_icons.show_3_persons_until){
                        obj.iconImgNumber = 3
                    }else if(obj.shortest_waiting_time <= this.Config.queue_status_icons.show_4_persons_until){
                        obj.iconImgNumber = 4
                    }else {
                        obj.iconImgNumber = 5
                    }

                    let time_to_wait_in_hours = Math.floor(obj.shortest_waiting_time/60)
                    let time_to_wait_in_minutes = obj.shortest_waiting_time % 60
                    obj.time_to_wait = 
                        (time_to_wait_in_hours>0?time_to_wait_in_hours+'h ':'')
                        +time_to_wait_in_minutes+' min'

                    return obj;
                });
                this.recommended_vendor = this.vendors[0]

                let i= 1;
                this.vendors.map((vendor)=>{
                    this.markers.push({
                        id: i,
                        position: {
                            lat: Number(vendor.lat), lng: Number(vendor.lng)
                        },
                        vendor
                    })
                    i++
                    return vendor
                });
            }.bind(this)).finally(() => {
                this.loading = false
                this.loading_map = false
            })
        },
        show(){
            $('#LangindAgenciesMobile').css('margin-left', '0')
        },
        hide(){
            $('#LangindAgenciesMobile').css('margin-left', '100%')
            this.$emit('removeBorder')
        }
    }
})
</script>

<style lang="scss" scoped>
    #LangindAgenciesMobile{
        width: 100vw;
        height: 100%;
        overflow: scroll !important;
        position: absolute;
        top: 0;
        transition: .5s;
        background: #fff;

        margin-left: 100%;
        .window_closer{
            font-size: 15px;
            color: #555;
            cursor: pointer;
            transition: .3s;
            float: right;
            margin-top: 10px;
            padding: 10px 20px 0 20px;
        }
        .window_closer:hover{
            transform: scale(1.02);
        }
        .section-loader{
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            img{
                width: 50px;
            }
            span{
                display: block;
                font-size: 15px;
                margin-top: 15px;
            }
        }
        .right{
            padding: 0 20px;
            // overflow-y: scroll !important;
            .subtitle{
                margin-top: 20px;
                font-size: 17px;
                color: #555;
                letter-spacing: 2px;
            }
        }
    }
</style>