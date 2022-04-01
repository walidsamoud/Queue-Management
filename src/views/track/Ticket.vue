<template>
    <div id="Ticket">
        <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-4 top" v-if="ticket">
                <div class="return" @click="$router.push('/')">
                    <font-awesome-icon class="icon ml-2" icon="arrow-left" /> 
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
        <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-4 content" v-if="ticket">
                <div class="backyard"></div>
                <div class="header">
                    <div class="logo">
                        <img :src="ticket.business_summary.photo" alt="">
                    </div>
                    <div class="name">
                        {{ ticket.business_summary.name }}
                        <br>
                        <a 
                            class="badge badge-secondary" 
                            :href="'https://www.google.com/maps/dir/'+position.lat+','+position.lng+'/'+ticket.business_summary.lat+','+ticket.business_summary.lng+'?hl=fr&z=14'"
                            target="_blank"
                            v-if="position_is_correct"
                        >
                            {{$t('Directions')}}
                            <img src="/Vector.png" alt="">
                        </a>
                        <a 
                            class="badge badge-secondary" 
                            :href="'https://maps.google.com/maps?q='+ticket.business_summary.lat+','+ticket.business_summary.lng+'&hl=fr&z=14'"
                            target="_blank"
                            v-else
                        >
                            {{$t('Directions')}}
                            <img src="/Vector.png" alt="">
                        </a>
                    </div>
                    <div class="circle">
                        <div class="countdown" v-if="seconds_left > 0">
                            <circular-count-down-timer
                                :main-circle-id="1"
                                :circles="[{
                                    id: 1,
                                    size: 75,
                                    value: seconds_left,
                                    steps: ticket.waiting_time,
                                    stepLength: -1,
                                    showValue: false,
                                    fillColor: Config.colors.primary.default,
                                    strokeWidth: 7,
                                    strokeColor: Config.colors.secondary.default,
                                }]"
                                :stop-conditions="{ '1': 0 }"
                            ></circular-count-down-timer>
                            <span class="count_down_value">{{time_left}}</span>
                        </div>
                        <div class="countdown" v-else>
                            <span class="count_down_value ready">{{$t('YourTurn1')}}<br>{{$t('YourTurn2')}}</span>
                        </div>
                    </div>
                </div>
                <div class="ticket">
                    <div class="number">
                        <span>{{$t('TicketNo')}} {{ ticket.public_identifier }}</span>
                    </div>
                    <div class="divider">
                        <object class="svg" data="/ticketDivider2.svg" type="image/svg+xml"></object>
                    </div>
                    <div class="body">
                        <div class="info">
                            <div class="left">
                                <span>{{$t('YourRank')}}</span>
                                <b>#{{ ticket.queue_rank }}</b>
                            </div>
                            <div class="right">
                                <span>{{$t('BeThereAt')}}</span>
                                <b>{{shouldBeThereAt}}</b>
                            </div>
                        </div>
                        <div class="services">
                            <div class="left"><span>{{$t('ServicesPlural')}}</span></div>
                            <div class="right">
                                <span v-for="service in ticket.services" :key="'service'+service.id">
                                    {{service.title}}
                                </span>
                            </div>
                        </div>
                        <div class="date_join">
                            <small>{{$t('JoinedAt')}} {{ticket.checkinTime}}</small>
                            <span v-if="is_running_late">{{$t('YouSentLateNotif')}}</span>
                        </div>
                        <div class="footer">
                            <div class="left" @click="late_modal.active = true">
                                <img src="/clock_yellow.png" alt="">
                                <span>{{$t('Late')}}</span>
                            </div>
                            <div class="right" @click="cancel_ticket_modal.active = true">
                                <img src="/times_red.png" alt="">
                                <span>{{$t('Cancel')}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <a :href="Config.ticket.ads.href" class="pub" v-if="Config.ticket.ads.status && Config.ticket.ads.type=='image'">
                    <img class="w-100" :src="Config.ticket.ads.url" alt="">
                </a>
                <div class="copyright" v-if="Config.ticket.copyright.status">
                    <div class="logo">
                        <img 
                            :src="'/liberrex.png'" 
                            alt="Liberrex" 
                            :style="'height: '+Config.ticket.copyright.logo.height+'; width: '+Config.ticket.copyright.logo.width"
                        >
                    </div>
                    <div class="text">
                        <template v-if="$i18n.locale=='en'">{{ Config.ticket.copyright.text.en }}</template>
                        <template v-else-if="$i18n.locale=='fr'">{{ Config.ticket.copyright.text.fr }}</template>
                        <template v-else-if="$i18n.locale=='ar'">{{ Config.ticket.copyright.text.ar }}</template>
                        <template v-else>{{ Config.ticket.copyright.text.fr }}</template>
                    </div>
                    <div class="url">
                        <a :href="Config.ticket.copyright.link.href">{{ Config.ticket.copyright.link.text }}</a>
                    </div>
                </div>
            </div>
        </div>
        <CancelTicket 
            :active="cancel_ticket_modal.active"
            :type="cancel_ticket_modal.type"
            @confirm="ConfirmCancelTicket"
            @cancel="CloseCancelTicket"
        />
        <RunningLate 
            :active="late_modal.active"
            :type="late_modal.type"
            @confirm="ConfirmLateModal"
            @cancel="CloseLateModal"
        />
    </div>
</template>

<script>
import moment from 'moment'
import $ from 'jquery'

import { queueService } from '../../_services'
import CancelTicket from '../modals/CancelTicket.vue'
import RunningLate from '../modals/RunningLate.vue'

export default({
    data:()=> ({
        ticket_uid: null,
        ticket: null,
        is_running_late: 0,
        seconds_left: null,
        time_left: '--',
        time_left_interval: null,

        cancel_ticket_modal: {
            active: false,
            type: 'danger',
        },
        late_modal: {
            active: false,
            type: 'warning',
        },

        position: {
            lat: 36,
            lng: 10
        },
        position_is_correct: false,
        language: localStorage.getItem('Language'),
        show_all_languages: false
    }),
    components:{
        CancelTicket,
        RunningLate
    },
    methods:{
        changeLanguage(language){
            localStorage.setItem('Language', language)
            this.$router.go()
        },
        ConfirmLateModal(){
            this.late_modal.active = false
            $('#PreLoader').show();
            let data= {
                queue_line_id: this.ticket.queue_line_id,
                ticket_id: this.ticket.id,
                rank: this.ticket.queue_rank
            }
            queueService.moveToLast(data).then(function () {
                this.is_running_late = true
                this.initPage()
            }.bind(this)).catch(function(){
                $('#PreLoader').hide();
            });
        },
        CloseLateModal(){
            this.late_modal.active = false
        },
        ConfirmCancelTicket(){
            this.cancel_ticket_modal.active = false
            $('#PreLoader').show();

            queueService.revokeTicketByUid(this.ticket_uid).then(function () {
                location.replace('/');
            }.bind(this)).finally(function () {
                $('#PreLoader').hide();
            }.bind(this));
        },
        CloseCancelTicket(){
            this.cancel_ticket_modal.active = false
        },
        initPage(){
            $('#PreLoader').show();
            this.ticket_uid = this.$route.params.uid;
            queueService.getTicketByUid(this.ticket_uid).then(function(data){
                this.ticket = data.ticket;
                this.is_running_late = this.ticket.running_late
                this.seconds_left = this.ticket.waiting_time

                this.time_left_interval = setInterval(function(){
                    if(this.seconds_left){
                        let time_left_h = Math.floor( this.seconds_left/3600 )
                        let time_left_m = Math.floor( (this.seconds_left%3600)/60 )
                        let time_left_s = Math.floor( (this.seconds_left%3600)%60 )
                        if(time_left_h>0){
                            this.time_left = time_left_h+'h '+time_left_m+'m'
                        }else{
                            this.time_left = time_left_m+'m '+time_left_s+'s'
                        }
                        this.seconds_left--
                    }else{
                        this.time_left = '--'
                    }
                }.bind(this), 1000)
            }.bind(this)).catch(function(){
                window.location.href = '/'
            }).finally(function(){
                $('#PreLoader').hide();
            })
        }
    },
    computed:{
        checkinTimeDateFormated: function () {
            return moment(this.ticket.checkinDate + ' ' + this.ticket.checkinTime).format('HH:mm');
        },
        waitingTimeFormated: function () {
            return moment().startOf('day').add(this.ticket.waiting_time, 'seconds').format('HH:mm');
        },
        shouldBeThereAt: function () {
            return moment().add(this.ticket.waiting_time, 'seconds').format('HH:mm');
        },
    },
    mounted(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                this.position.lat = position.coords.latitude
                this.position.lng = position.coords.longitude
                this.position_is_correct = true
            }.bind(this));
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        this.initPage();
    }
})
</script>

<style lang="scss">
    .circle__value{
        color: var(--primary-font) !important;
    }
</style>
<style lang="scss" scoped>
    #Ticket{
        // height: 100vh !important;
        overflow-x: hidden !important;
        overflow-y: scroll !important;
        position: relative;
        .top{
            top: 0%;
            left: 50%;
            transform: translate(-50%, 0%);
            position: relative;
            width: 100%;
            text-align: right;
            padding: 10px 30px;
            background: var(--primary);
            border-bottom: 1px solid #dfe4ea93;
            .return{
                float: left;
                color: var(--primary-font);
                margin-top: 3px;
                cursor: pointer;
            }
            .language{
                cursor: pointer;
                img{
                    height: 12px;
                    width: 20px;
                    margin-top: -5px;
                    border-radius: 2px;
                }
                .icon{
                    color: var(--primary-font);
                }
                span, a{
                    font-size: 13px;
                    padding-left: 10px;
                    letter-spacing: 1px;
                    color: var(--primary-font);
                }
            }
            .all_languages{
                position: absolute;
                z-index: 9999999999;
                top: 40px;
                right: 10px;
                // padding: 10px;
                box-shadow: 0 0 1px 1px #ccc;
                background: #fff;
                cursor: pointer;
                transition: .3s;
                text-align: left;
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
        .loader{
            margin-top: 50%;
            margin-left: 50%;
            transform: translate(-50%, 0);
            img{
                width: 50px;
            }
        }
        .backyard{
            background: var(--primary);
            border-radius: 0 0 10px 10px;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 65vh;
            z-index: -1;
        }
        .content{
            top: 0%;
            left: 50%;
            transform: translate(-50%, 0%);
            max-height: 100vh;
            width: 100%;
            // background: var(--primary);
            padding: 30px;
            // overflow-x: hidden !important;
            // overflow-y: scroll !important;
            .header{
                display: flex;
                justify-content: space-between;
                z-index: 999;
                .logo{
                    width: 20%;
                    img{
                        width: 75px;
                        border-radius: 5px;
                    }
                }
                .name{
                    width: 50%;
                    color: var(--primary-font);
                    font-weight: bold;
                    font-size: 17px;
                    .badge{
                        margin-top: 10px;
                        border-radius: 100px;
                        background: var(--secondary);
                        color: var(--secondary-font);
                        padding: 7px 15px;
                    }
                }
                .circle{
                    width: 75px;
                    text-align: right;
                    position: relative;
                    img{
                        width: 100%;
                    }
                    .count_down_value{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: var(--primary-font) !important;
                        display: block;
                        white-space: nowrap;
                        margin-left: 5px;
                    }
                    .ready{
                        font-weight: 900 !important;
                        color: var(--secondary) !important;
                        font-size: 15px;
                        // white-space: normal;
                        text-align: center;
                        // border-top: 2px solid var(--secondary);
                        border-bottom: 2px solid var(--secondary);
                        padding: 5px;
                    }
                }
            }

            .ticket{
                z-index: 999;
                border-radius: 10px;
                margin-top: 30px;
                // -webkit-filter: drop-shadow(2px 5px 5px #888);
                // filter: drop-shadow(2px 5px 5px #888);
                // border: 1px solid var(--primary);
                box-shadow: 0 4px 2px -2px #c7ccd3;
                .number{
                    padding: 10px 0 0 0;
                    text-align: center;
                    font-size: 45px;
                    font-weight: 900;
                    color: var(--primary);
                    border-radius: 10px 10px 0 0;
                    background: #fff;
                }
                .divider{
                    width: 100%;
                    z-index: -1;
                    margin-top: -15px;
                    margin-bottom: -10px;
                    .svg{
                        width: 100%;
                        // padding-right: 0.5px
                    }
                }
                .body{
                    border-radius: 0 0 10px 10px;
                    background: #fff;
                    padding: 0 20px 20px 20px;
                    line-height: 1.5;
                    .info{
                        display: flex;
                        justify-content: space-evenly;
                        text-align: center;
                        border-bottom: 2px solid #DFE4EA;
                        padding-bottom: 20px;
                        .left{
                            width: 50%;
                            border-right: 2px solid #DFE4EA;
                        }
                        .right{
                            width: 50%;
                        }
                        span{
                            font-size: 17px;
                            font-weight: 300;
                            display: block;
                            color: var(--special-font)
                        }
                        b{
                            font-size: 25px;
                            font-weight: 900;
                            color: var(--primary);
                            font-family:Arial, Helvetica, sans-serif !important;
                        }
                    }
                }
                .services{
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0 20px 0;
                    line-height: 2;
                    .left{
                        font-weight: bold;
                        font-size: 17px;
                        width: 40%;
                        color: var(--special-font);
                    }
                    .right{
                        text-align: right;
                        width: 60%;
                        span{
                            color: var(--secondary);
                            font-weight: bold;
                            font-size: 17px;
                            display: block;
                        }
                    }
                }
                .date_join{
                    width: 100%;
                    text-align: center;
                    border-bottom: 2px solid #DFE4EA;
                    padding-bottom: 10px;
                    small{
                        color: var(--special-font);
                        font-size: 12px;
                    }
                    span{
                        display: block;
                        color: #f7ad36;
                    }
                }
                .footer{
                    display: flex;
                    justify-content: space-around;
                    padding-top: 20px;
                    .left{
                        border-right: 2px solid #DFE4EA;
                        width: 50%;
                        text-align: center;
                        cursor: pointer;
                        span{
                            color: #f7ad36;
                            font-weight: bold;
                            display: block;
                            font-size: 15px;
                        }
                    }
                    .right{
                        width: 50%;
                        text-align: center;
                        cursor: pointer;
                        span{
                            color: #E31D1A;
                            font-weight: bold;
                            display: block;
                            font-size: 15px;
                        }
                    }
                }
            }
            .pub{
            }
            .copyright{
                text-align: center;
                font-size: 15px;
                padding-top: 20px;
                padding-bottom: 50px;
            }
        }
    }
</style>