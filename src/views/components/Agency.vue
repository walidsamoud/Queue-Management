<template>
    <div id="LandingAgence">
        <div class="vendor" :class="Recommended?'recommended-vendor':''">
            <div class="left2">
                <b class="name">{{Vendor.name}}</b>
                <div class="address">
                    <font-awesome-icon class="icon" icon="map-marker-alt" :style="Config.vendor.icons_color_in_list?{ color: Config.vendor.icons_color_in_list }:''"/> 
                    <span>{{Vendor.address}}</span>
                </div>
                <div class="infos">
                    <div class="info">
                        <font-awesome-icon class="icon" icon="clock" :style="Config.vendor.icons_color_in_list?{ color: Config.vendor.icons_color_in_list }:''"/> 
                        <span>{{Vendor.time_to_wait}}</span>
                    </div>
                    <div class="info">
                        <font-awesome-icon class="icon" icon="map-marker-alt" :style="Config.vendor.icons_color_in_list?{ color: Config.vendor.icons_color_in_list }:''"/> 
                        <span>{{Vendor.distance}} {{$t('Km')}}</span>
                    </div>
                    <div class="info">
                        <font-awesome-icon class="icon" icon="star" :style="Config.vendor.icons_color_in_list?{ color: Config.vendor.icons_color_in_list }:''"/> 
                        <span>{{Vendor.rating>0?Vendor.rating:'--'}}</span>
                    </div>
                </div>
            </div>
            <div class="right2">
                <img class="icon status-icon" :src="'/Queue-Icon '+Vendor.iconImgNumber+'.svg'" alt="">
            </div>
            <div class="badge">
                <small :style="Config.recommendation_text_color?'color: '+Config.recommendation_text_color+';':''">{{$t('Recommended')}}</small>
                <img :src="Config.recommendation_badge" alt="Badge">
            </div>
        </div>
    </div>
</template>

<script>
export default({
    data:()=>({

    }),
    props:{
        Recommended: Boolean,
        Vendor: Object
    },
    components:{},
    mounted(){
    },
    methods:{
 
    }
})
</script>

<style lang="scss" scoped>
    #LandingAgence{
        .vendor{
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 10px;
            box-shadow: 0 0 2px 1px #ddd;
            position: relative;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            transition: .3s;
            .name{
                letter-spacing: 1px;
                margin-top: 5px;
            }
            .address{
                margin-top: 5px;
            }
            .infos{
                display: flex;
                justify-content: left;
                margin-top: 5px;
                .info{
                    margin-right: 10px;
                }
            }
            .icon{
                margin-right: 5px;
                color: var(--secondary);
            }
            .badge{
                display: none;
            }
            .status-icon{
                margin-top: 15px;
                margin-right: 0 !important;
            }
        }
        .recommended-vendor{
            background: var(--primary);
            color: var(--primary-font) !important;
            box-shadow: none !important;
            padding-top: 15px;
            .badge{
                display: block !important;
                position: absolute;
                right: 15px;
                top: -8px;
                color: var(--secondary);
                font-weight: 500;
                img{
                    width: 15px;
                    margin-left: 10px;
                }
                small{
                    font-size: 9px;
                    margin-top: -10px;
                }
            }
            .status-icon{
                display: none;
            }
        }
        .vendor:hover{
            transform: scale(1.02);
        }
    }
</style>