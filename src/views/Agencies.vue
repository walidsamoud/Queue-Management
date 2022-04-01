<template>
    <div id="LangindAgencies" class="row">
        <div class="left col-md-6" style="background: #ddd;" v-if="loading_map">
            <button class="btn btn-primary goBack" @click="hide(); $emit('backHome')">
                <font-awesome-icon class="icon" icon="chevron-left" /> 
                <span>{{$t('Home')}}</span>
            </button>
            <div class="section-loader">
                <img src="/world-loader-white.gif" alt="" style="width: 100px;">
            </div>
        </div>
        <div class="left col-md-6" v-else>
            <button class="btn btn-primary goBack" @click="hide(); $emit('backHome')">
                <font-awesome-icon class="icon" icon="chevron-left" /> 
                <span>{{$t('Home')}}</span>
            </button>
            <GmapMap
                :center="center"
                :zoom="13"
                ref="Gmap"
                map-type-id="terrain"
                class="map"
                :disableDefaultUI="true"
                :options="{
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true,
                    disableDefaultUi: false,
                    styles: styles
                }"
            >
                <GmapMarker 
                    v-if="position_is_correct"
                    :position="position"
                    @click="opened_info_window=0"
                    :clickable="true"
                    :icon="{
                        url: Config.map.pin_me,
                        scaledSize: {width: 25, height: 25},
                        labelOrigin: {x: 0, y: 0}
                    }"
                >
                    <GmapInfoWindow
                        style="color: #333 !important;"
                        :opened="opened_info_window==0"
                    >
                        <div class="title">{{$t('MyPosition')}}</div>
                    </GmapInfoWindow>
                </GmapMarker>
                <GmapCluster :zoomOnClick="true">
                    <GmapMarker
                        :key="'Marker'+index"
                        v-for="(m, index) in markers"
                        :position="m.position"
                        @click="opened_info_window=m.vendor.id"
                        :clickable="true"
                        :icon="{
                            url: Config.map.marker,
                            scaledSize: {width: 40, height: 50},
                            labelOrigin: {x: 20, y: 25}
                        }"
                    >
                        <GmapInfoWindow
                            style="overflow-x: hidden !important;"
                            :opened="opened_info_window==m.vendor.id"
                            @click="openVendor(m.vendor.shortcode)"
                        >
                            <div class="m-0 p-0" @click="openVendor(m.vendor.shortcode)">
                                <MapWindowAgency :Recommended="false" :Vendor="m.vendor" @click="openVendor(m.vendor.shortcode)"/>
                            </div>

                        </GmapInfoWindow>
                    </GmapMarker>
                </GmapCluster>
            </GmapMap>
        </div>
        <div class="right col-md-6" v-if="loading">
            <div class="section-loader">
                <img src="/loader-circle.gif" alt="">
                <span>{{$t('Loading')}}</span>
            </div>
        </div>
        <div class="right col-md-6" v-else>
            <div class="recommendation" v-if="recommended_vendor">
                <div class="subtitle">
                    - {{$t('Recommended')}}
                </div>

                <div class="row">
                    <div class="col-md-6 p-2" @click="openVendor(recommended_vendor.shortcode);pinMapTo(recommended_vendor.id, {lat: recommended_vendor.lat, lng: recommended_vendor.lng});">
                        <Agency :Recommended="true" :Vendor="recommended_vendor"/>
                    </div>
                </div>
            </div>

            <div class="vendors" v-if="vendors && vendors.length">
                <div class="subtitle">
                    - {{$t('YouCanAlsoFind')}}
                </div>

                <div class="row">
                    <div class="col-md-6 p-2" v-for="item in vendors" :key="item.id" @click="openVendor(item.shortcode);pinMapTo(item.id, {lat: item.lat, lng: item.lng});">
                        <Agency :Recommended="false" :Vendor="item"/>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import Agency from './components/Agency.vue'
import MapWindowAgency from './components/MapWindowAgency.vue'
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
        center: {
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
        opened_info_window: 0,

        styles: [
            {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "poi",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road",
                elementType: "labels.icon",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road.local",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "transit",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            }
        ],
    }),
    components:{
        Agency,
        MapWindowAgency,
        GmapCluster
    },
    mounted(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                this.position.lat = position.coords.latitude
                this.position.lng = position.coords.longitude
                this.position_is_correct = true

                this.center.lat = position.coords.latitude
                this.center.lng = position.coords.longitude
                this.initPage();
            }.bind(this));
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    methods:{
        pinMapTo(id, position){
            this.opened_info_window = id
            // this.center = position
            this.$refs.Gmap.panTo(position)
        },
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
                        +time_to_wait_in_minutes+' '+this.$t('Min')

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
            $('#LangindAgencies').css('margin-left', '0')
            // $('#LangindAgencies').css('display', 'block')
        },
        hide(){
            $('#LangindAgencies').css('margin-left', '100%')
            this.$emit('removeBorder')
        }
    }
})
</script>

<style lang="scss" scoped>
    #LangindAgencies{
        width: 100vw;
        height: 100vh;
        overflow: hidden !important;
        position: absolute;
        top: 0;
        transition: .5s;
        background: #fff;

        margin-left: 100%;
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
        .left{
            z-index: 98;
            button{
                position: absolute;
                top: 10px;
                left: 10px;
                background: var(--primary);
                color: var(--primary-font);
                border-radius: 3px;
                z-index: 99;
                padding: 5px 15px;
                height: 35px;
                .icon{
                    margin-right: 5px;
                    font-size: 10px;
                }
            }
            button:hover{
                background: var(--primary-hover);
            }
            .map{
                width: 100%;
                height: 100vh; min-height: -webkit-fill-available;
                z-index: 98;
            }
        }
        .right{
            padding: 10px 20px 40px 20px;
            overflow-y: scroll !important;
            height: 100vh; min-height: -webkit-fill-available;
            .subtitle{
                margin-top: 20px;
                font-size: 17px;
                color: #555;
                letter-spacing: 2px;
            }
        }
    }
</style>