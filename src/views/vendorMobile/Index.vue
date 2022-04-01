<template>
    <div id="LandingAgency" class="row">
        <div class="right col-12" v-if="loading || !vendor">
            <div class="section-loader">
                <img src="/loader-circle.gif" alt="">
                <span>{{$t('Loading')}}</span>
            </div>
        </div>
        <div class="right col-12" v-else-if="vendor">
            <div class="window_closer" @click="hide()">
                <font-awesome-icon class="icon" icon="times" /> 
            </div>
            <div class="header row">
                <div class="col-2 image">
                    <img :src="vendor.photo" alt="">
                </div>
                <div class="col-10 data">
                    <span class="name">
                        {{vendor.name}} 
                        <small v-if="vendor.status" style="margin-left: 10px;color: #00C851 !important;font-weight: bold;font-size: 13px;">{{$t('Open')}}</small>
                        <small v-else style="margin-left: 10px;color: #ff3547 !important;font-weight: bold;font-size: 13px;">{{$t('Closed')}}</small>
                    </span>
                    <div class="row m-0">
                        <div class="col-8 info m-0">
                            <!-- <div class="address">
                                <font-awesome-icon class="icon" icon="map-marker" /> 
                                {{vendor.address}}
                            </div> -->
                            <div class="rating m-0">
                                <font-awesome-icon 
                                    class="icon filled-star" 
                                    icon="star" 
                                    v-for="(item, index) in vendor.rating"
                                    :key="'filled'+index"
                                />
                                <font-awesome-icon 
                                    class="icon star" 
                                    icon="star" 
                                    v-for="(item, index) in 5-Math.floor(vendor.rating)"
                                    :key="'empty'+index"
                                />
                                <span class="reviews ml-3">( {{vendor.reviews}} {{$t('Reviews')}} )</span>
                            </div>
                        </div>
                        <div class="col-4 persons d-none">
                            <img class="icon" :src="'/Queue-Icon '+vendor.iconImgNumber+'.svg'" alt="">
                            <!-- <span class="open" v-if="vendor.status">Ouvert</span>
                            <span class="closed text-danger" v-else>Fermé</span> -->
                        </div>
                    </div>
                </div>
            </div>

            <div id="body_content" v-if="!opting_for">
                <div class="tabs">
                    <div 
                        class="tab about" 
                        :class="active_tab=='about'?'active':''"
                        @click="active_tab='about'"
                    >
                        {{$t('About')}}
                        <hr class="line">
                    </div>
                    <div 
                        class="tab services" 
                        :class="active_tab=='services'?'active':''"
                        @click="active_tab='services'"
                    >
                        {{$t('Services')}}
                        <hr class="line">
                    </div>
                    <div 
                        class="tab about" 
                        :class="active_tab=='reviews'?'active':''"
                        @click="active_tab='reviews';vendor.reviews && reviews_page==1?loadReviews():''"
                    >
                        {{$t('Reviews')}}
                        <hr class="line">
                    </div>
                </div>

                <div class="body" v-if="active_tab=='about'">
                    <div class="row row_data working_days">
                        <div class="col-2 icon text-center">
                            <img :src="Config.vendor.icons.clock" alt="">
                        </div>
                        <div class="col-8 info">
                            <span class="day" v-for="(day, index) in vendor.working_days" :key="'day'+day.id">
                                <span v-if="day.active">{{vendor_working_days_names[language][index]}}, {{day.start_time.substr(0, 5)}} - {{day.end_time.substr(0, 5)}}</span>
                                <span v-else class="text-danger">{{vendor_working_days_names[language][index]}}, {{$t('Closed')}}</span>
                            </span>
                        </div>
                        <!-- <div class="col-md-2 status text-right">
                            <span class="open" v-if="vendor.status">Ouvert</span>
                            <span class="closed text-danger" v-else>Fermé</span>
                        </div> -->
                    </div>

                    <div class="row row_data working_days">
                        <div class="col-2 icon text-center">
                            <img :src="Config.vendor.icons.location" alt="">
                        </div>
                        <div class="col-10 info">
                            <span>{{vendor.email}}</span>
                            <span>{{vendor.phone}}</span>
                        </div>
                    </div>
                    
                    <div class="row row_data working_days">
                        <div class="col-2 icon text-center">
                            <img :src="Config.vendor.icons.info" alt="">
                        </div>
                        <div class="col-10 info">
                            <span style="margin-top: 10px;">{{vendor.address}}</span>
                        </div>
                    </div>
                </div>

                <!-- <div class="tabs">
                    <div 
                        class="tab active about" 
                    >
                        Service
                        <hr class="line">
                    </div>
                </div> -->

                <div class="services" v-if="active_tab=='services'">
                    <div class="empty" v-if="!vendor.services.length">
                        <!-- <img src="/empty.png" alt=""> -->
                        <p>{{$t('AgencyMaintenance')}}</p>
                    </div>
                    <div class="service" v-else v-for="service in vendor.services" :key="'service'+service.id">
                        <span class="btn badge">
                            {{service.title}}
                        </span>
                    </div>
                </div>

                <div class="reviews" v-if="active_tab=='reviews'">
                    <div class="empty" v-if="!vendor.reviews">
                        <!-- <img src="/empty.png" alt=""> -->
                        <p>{{$t('NoReviewsYet')}}</p>
                    </div>
                    <div class="section-loader" v-if="loading_reviews">
                        <img src="/loader-circle.gif" alt="">
                    </div>
                    <div v-else>
                        <div class="review" v-for="(review, index) in reviews" :key="'review'+review.id+index">
                            <div class="inner row">
                                <div class="col-2 text-center">
                                    <img src="/user_placeholder.png" alt="">
                                </div>
                                <div class="col-10 content">
                                    <div class="first_line">
                                        <div>
                                            <span class="name" v-if="review.fname || review.lname">{{review.fname}} {{review.lname}}</span>
                                            <span class="name" style="color: #888;" v-else>{{$t('Anonymous')}}</span>
                                            <br>
                                            <span class="date"> {{review.created_at}}</span>
                                        </div>
                                        <div>
                                            <font-awesome-icon 
                                                class="icon filled-star" 
                                                icon="star" 
                                                v-for="(item, index) in review.rating"
                                                :key="'filled2'+index"
                                            />
                                            <font-awesome-icon 
                                                class="icon star" 
                                                icon="star" 
                                                v-for="(item, index) in 5-Math.floor(review.rating)"
                                                :key="'empty2'+index"
                                            />
                                        </div>
                                    </div>
                                    <div class="text">
                                        {{review.feedback?review.feedback:'--'}}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-100 text-center" v-if="reviews_next_page && vendor.reviews">
                            <button class="load_more btn btn-primary" @click="loadReviews()" v-if="!loading_more_reviews">{{$t('ShowMore')}}</button>
                            <button class="load_more btn btn-primary" v-else>
                                <font-awesome-icon class="icon spin-icon" icon="spinner" /> 
                            </button>
                        </div>
                    </div>
                </div>

                <div class="buttons">
                    <button class="button mr-2" @click="optForQueues()" v-if="vendor.status">
                        {{$t('Ticket')}}
                    </button>
                    <button class="button mr-2" style="opacity: .6;" v-else>
                        {{$t('Ticket')}} <small class="closedBadge">{{$t('Closed')}}</small>
                    </button>
                    <button class="button button-filled ml-2" @click="optForBookings()">
                        {{$t('Appointment')}}
                    </button>
                </div>
            </div>

            <div id="Queues" class="ml-4 mt-3" v-if="opting_for=='Queues'">
                <Queues ref="Queues" :Vendor="vendor" @goBack="opting_for=null"/>
            </div>

            <div id="Bookings" class="mt-3" v-if="opting_for=='Bookings'">
                <Bookings ref="Bookings" :Vendor="vendor" :User="user" @goBack="opting_for=null"/>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import Agency from '../components/Agency.vue'
import { vendorsService, feedbackService } from '/src/_services'
import Queues from './Queues.vue'
import Bookings from './Bookings.vue'

import moment from 'moment'

export default({
    data:()=>({
        loading: true,
        loading_reviews: false,
        loading_more_reviews: false,
        user: null,
        vendor: null,
        language: 'fr',
        vendor_working_days_names:{
            en: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            fr: [
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendreri",
                "Samedi",
                "Dimanche"
            ],
            ar: [
                "الإثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت",
                "الأحَد"
            ]
        },
        active_tab: 'about',
        opting_for: null,

        reviews: [],
        reviews_page: 1,
        reviews_next_page: true
    }),
    components:{
        Agency,
        Queues,
        Bookings,
    },
    mounted(){
        this.user = JSON.parse( localStorage.getItem('user') )
        this.language = localStorage.getItem('Language')
    },
    methods:{
        loadReviews(){
            if(!this.reviews.length){
                this.loading_reviews = true
            }else{
                this.loading_more_reviews = true
            }
                feedbackService.getPage(this.vendor.id, this.reviews_page).then(function(data){
                    if(data.feedback.data.length){
                        data.feedback.data.map((obj)=>{
                            obj.created_at = moment(obj.created_at).format('DD MMM YYYY')
                            this.reviews.push(obj)
                        })
                    }else{
                        this.reviews_next_page = false
                    }
                }.bind(this)).finally(function(){
                    this.loading_reviews = false
                    this.loading_more_reviews = false
                    this.reviews_page++
                }.bind(this))
        },
        optForQueues(){
            let user = localStorage.getItem('user')
            if(!user){
                this.$emit('login')
            }else{
                this.opting_for = 'Queues'
            }
        },
        optForBookings(){
            let user = localStorage.getItem('user')
            if(!user){
                this.$emit('login')
            }else{
                this.opting_for = 'Bookings'
            }
        },
        initPageByShortCode(shortcode = null){
            this.loading = true
            vendorsService.getByShortCode(shortcode).then(function(data){
                this.vendor = data.data
                //Pin vendor to map
                this.$emit('pinMapTo', this.vendor.id , {lat: this.vendor.lat, lng: this.vendor.lng})

                //Combine member first name & last name for Booking v-select
                this.vendor.departments.map((dep)=>{
                    dep.dep_members = dep.dep_members.map((member)=>{
                        member.fullname = member.fname + ' ' +member.lname
                        return member
                    })

                    return dep
                })
                //Specify vendor status icon
                if(!this.vendor.shortest_waiting_time || this.vendor.shortest_waiting_time == 0){
                    this.vendor.iconImgNumber = 0
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_1_person_until){
                    this.vendor.iconImgNumber = 1
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_2_persons_until){
                    this.vendor.iconImgNumber = 2
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_3_persons_until){
                    this.vendor.iconImgNumber = 3
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_4_persons_until){
                    this.vendor.iconImgNumber = 4
                }else {
                    this.vendor.iconImgNumber = 5
                }

                //Specify queues status icons
                this.vendor.queues.map((obj)=>{
                    if(!obj.waitingTime || obj.waitingTime == 0){
                        obj.iconImgNumber = 0
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_1_person_until){
                        obj.iconImgNumber = 1
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_2_persons_until){
                        obj.iconImgNumber = 2
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_3_persons_until){
                        obj.iconImgNumber = 3
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_4_persons_until){
                        obj.iconImgNumber = 4
                    }else {
                        obj.iconImgNumber = 5
                    }

                    let time_to_wait_in_hours = Math.floor(obj.waitingTime/60)
                    let time_to_wait_in_minutes = obj.waitingTime%60
                    obj.time_to_wait = 
                        (time_to_wait_in_hours>0?time_to_wait_in_hours+'h ':'')
                        +time_to_wait_in_minutes+' min'

                    return obj
                })
            }.bind(this)).finally(function(){
                this.loading = false
            }.bind(this))
        },
        initPage(hashed_id=null){
            this.loading = true
            vendorsService.getByHashedId(hashed_id).then(function(data){
                this.vendor = data.data
                //Pin vendor to map
                this.$emit('pinMapTo', this.vendor.id , {lat: this.vendor.lat, lng: this.vendor.lng})

                //Combine member first name & last name for Booking v-select
                this.vendor.departments.map((dep)=>{
                    dep.dep_members = dep.dep_members.map((member)=>{
                        member.fullname = member.fname + ' ' +member.lname
                        return member
                    })

                    return dep
                })
                //Specify vendor status icon
                if(!this.vendor.shortest_waiting_time || this.vendor.shortest_waiting_time == 0){
                    this.vendor.iconImgNumber = 0
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_1_person_until){
                    this.vendor.iconImgNumber = 1
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_2_persons_until){
                    this.vendor.iconImgNumber = 2
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_3_persons_until){
                    this.vendor.iconImgNumber = 3
                }else if(this.vendor.shortest_waiting_time <= this.Config.queue_status_icons.show_4_persons_until){
                    this.vendor.iconImgNumber = 4
                }else {
                    this.vendor.iconImgNumber = 5
                }

                //Specify queues status icons
                this.vendor.queues.map((obj)=>{
                    if(!obj.waitingTime || obj.waitingTime == 0){
                        obj.iconImgNumber = 0
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_1_person_until){
                        obj.iconImgNumber = 1
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_2_persons_until){
                        obj.iconImgNumber = 2
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_3_persons_until){
                        obj.iconImgNumber = 3
                    }else if(obj.waitingTime <= this.Config.queue_status_icons.show_4_persons_until){
                        obj.iconImgNumber = 4
                    }else {
                        obj.iconImgNumber = 5
                    }

                    let time_to_wait_in_hours = Math.floor(obj.waitingTime/60)
                    let time_to_wait_in_minutes = obj.waitingTime%60
                    obj.time_to_wait = 
                        (time_to_wait_in_hours>0?time_to_wait_in_hours+'h ':'')
                        +time_to_wait_in_minutes+' min'

                    return obj
                })
            }.bind(this)).finally(function(){
                this.loading = false
            }.bind(this))
        },
        getStatus(){
            if($('#LandingAgency').css('margin-left')=='0px'){
                return 'Open'
            }else{
                return 'Closed'
            }
        },
        showByShortCode(shortcode, from_home = false){
            //Signle animation
            $('#LandingAgency').css('margin-left', '0')

            if(!from_home){
                let query = this.$route.query
                query.hid = shortcode
                history.pushState(
                    {},
                    null,
                    '/'+query.hid
                )
            }
            if(!this.vendor || this.vendor.shortcode != shortcode){
                this.active_tab = 'about'
                this.opting_for = null
                this.reviews = []
                this.reviews_page = 1
                this.reviews_next_page = true
                this.initPageByShortCode(shortcode)
            }
        },
        show(hashed_id = null, from_home = false){
                //Signle animation
                $('#LandingAgency').css('margin-left', '0')

                //Double animation
                // if($('#LandingAgency').css('margin-left')=='0px'){
                //     $('#LandingAgency').css('margin-left', '100vw')
                //     setTimeout( function() {
                //         $('#LandingAgency').css('margin-left', '0')
                //     }, 300);
                // }else{
                //     $('#LandingAgency').css('margin-left', '0')
                // }
                if(!from_home){
                    let query = this.$route.query
                    query.hid = hashed_id
                    history.pushState(
                        {},
                        null,
                        '?hid='+query.hid
                    )
                }
                if(!this.vendor || this.vendor.hashedid != hashed_id){
                    this.active_tab = 'about'
                    this.opting_for = null
                    this.reviews = []
                    this.reviews_page = 1
                    this.reviews_next_page = true
                    this.initPage(hashed_id)
                }
        },
        hide(){
            $('#LandingAgency').css('margin-left', '100vw')
            if(!this.Config.is_organization){
                this.$emit('removeBorder')
            }
            
            let query = this.$route.query
            if(query.hid){
                delete query.hid;
            }

            history.pushState(
                {},
                null,
                '/'
            )

            // this.vendor = null
            this.opting_for = null
        }
    }
})
</script>

<style lang="scss" scoped>
    #LandingAgency{
        width: 100vw;
        height: 100vh; min-height: -webkit-fill-available;
        overflow-x: hidden !important;
        overflow-y: scroll !important;
        position: absolute;
        top: 0;
        transition: .5s;
        box-shadow: 0 0 2px 5px #ddd;

        margin-left: 100%;
        .window_closer{
            font-size: 15px;
            color: #555;
            float: right;
            cursor: pointer;
            transition: .3s;
        }
        .window_closer:hover{
            transform: scale(1.02);
        }
        .overlay{
            background: rgba($color: #000000, $alpha: 0.3);
            z-index: 97;
            cursor: pointer;
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
            background: #fff;
            padding: 20px 10px;
            margin-top: 5px;
            .header{
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
                .image{
                    width: 100%;
                    // padding: 10px;
                    img{
                        width: 100%;
                        border-radius: 5px;
                    }
                }
                .data{
                    padding: 0 20px;
                    .name{
                        font-weight: 900;
                        color: #555;
                        font-size: 15px;
                    }
                    .info{
                        .address{
                            color: #888;
                            font-weight: 700;
                            font-size: 12px;
                            letter-spacing: 1px;
                        }
                        .rating{
                            .icon, .reviews{
                                margin-top: 10px;
                                font-size: 12px;
                                color: #888;
                            }
                            .filled-star{
                                color: var(--secondary);
                            }
                        }
                    }
                    .persons{
                        text-align: right;
                        // margin-top: 10px;
                        img{
                            height: 30px;
                        float: right;
                        }
                        span{
                            display: block;
                        }
                    }
                }
            }
            .tabs{
                display: flex;
                justify-content: space-evenly;
                margin-top: 30px;
                .tab{
                    font-weight: 700;
                    font-size: 15px;
                    color: #888;
                    cursor:pointer;
                    transition: .3s;
                    width: 75px;
                    text-align: center;
                    .line{
                        height: 3px;
                        background: var(--primary);
                        border-radius: 5px;
                        width: 100%;
                        display: none;
                        transition: .3s;
                        margin-top: 5px;
                    }
                }
                .tab:hover{
                    color: var(--primary-hover);
                }
                .active{
                    color: var(--primary);
                    .line{
                        display: block !important;
                    }
                }
            }
            
            
            .body{
                padding: 20px 10px;
                .row_data{
                    .icon{
                        img{
                            padding: 10px;
                        }
                    }
                    .info{
                        margin-top: 5px;
                        padding: 0 10px;
                        span{
                            margin-top: 8px;
                            display: block;
                            font-weight: 600;
                            letter-spacing: 1px;
                            font-size: 12px;
                            color: var(--special-font);
                        }
                    }
                }
                .working_days{
                    .day{
                        // line-height: 1;
                        span{
                            font-size: 12px;
                        }
                    }
                    .status{
                        font-size: 17px;
                        font-weight: bold;
                        margin-top: 15px;
                        .open{
                            color: var(--success)
                        }
                        .closed{
                            // color: var(--danger)
                        }
                    }
                }
            }

            .services{
                margin-left: 0 !important;
                margin-bottom: 20px;
                .empty{
                    width: 100%;
                    text-align: center;
                    font-size: 15px;
                    padding-top: 30px;
                    img{
                        width: 200px;
                    }
                }
                .service{
                    display: inline-block;
                    padding: 0px 5px;
                    min-width: 20%;
                    span{
                        border: none;
                        border-bottom: 2px solid var(--secondary);
                        // background: var(--secondary);
                        color: var(--secondary);
                        padding: 8px 20px 0 20px;
                        border-radius: 0;
                        height: 35px;
                        font-size: 12px;
                        width: 100%;
                    }
                }
            }

            .reviews{
                padding-bottom: 70px;
                .empty{
                    width: 100%;
                    text-align: center;
                    font-size: 15px;
                    padding-top: 30px;
                    img{
                        width: 200px;
                    }
                }
                .section-loader{
                    margin-top: 50px;
                }
                .review{
                    margin-top: 10px;
                    .inner{
                        box-shadow: 0 0 1px 1px #ddd;
                        border-radius: 10px;
                        padding: 10px ;
                        img{
                            width: 100%;
                            // padding: 10px;
                            // width: 75px !important;
                            // max-width: 75px;
                        }
                        .content{
                            padding: 10px 20px;
                            .first_line{
                                display: flex;
                                justify-content: space-between;
                                .name{
                                    font-weight: bold;
                                    font-size: 14px;
                                    color: #333;
                                }
                                .date{
                                    font-size: 10px;
                                    color: #666;
                                    margin-left: 5px;
                                }
                                .star{
                                    color: #888;
                                }
                                .filled-star{
                                    color: var(--secondary);
                                }
                            }
                            .text{
                                margin-top: 10px;
                            }
                        }
                    }
                }
                .load_more{
                    background: var(--secondary);
                    border-color: var(--secondary-hover) !important;
                    color: var(--secondary-font);
                    padding: 5px 20px;
                    border-radius: 100px;
                    margin-top: 20px;
                    font-size: 15px;
                }
                .load_more:hover{
                    border-color: var(--secondary-hover) !important;
                }
            }

            .buttons{
                display: flex;
                justify-content: center;
                // position: absolute;
                // left: 50%;
                // bottom: 0;
                // transform: translate(-50%, 0);
                background: #fff;
                width: 100%;
                padding: 0 10px;
                .button{
                    border: 3px solid var(--primary);
                    border-radius: 100px;
                    height: 40px;
                    transition: .3s;
                    color: var(--primary);
                    background: #fff;
                    font-size: 15px;
                    width: 200px;
                    .closedBadge{
                        background: var(--danger);
                        color: var(--danger-font);
                        border-radius: 20px;
                        padding: 3px 10px;
                        font-size: 10px;
                    }
                }
                .button:hover{
                    transform: scale(1.02);
                }
                .button-filled{
                    background: var(--primary);
                    color: var(--primary-font);
                }
            }
        }
        .back_btn{
            border-radius: 3px;
            border: none;
            background: var(--secondary);
            color: var(--secondary-font);
            font-size: 13px;
            margin-left: -30px;
            margin-bottom: 20px;
            .icon{
                font-size: 11px;
                margin-right: 10px;
            }
        }
    }
</style>