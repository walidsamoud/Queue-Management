<template>
    <div id="Profile" v-if="user">
        <div class="overlay" @click="hide()"></div>
        <div id="ProfileModal" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" @click="hide()">&times;</a>
            <div class="logout" @click="logout">
                <img :src="'/logout.png'" alt="">
            </div>
            

            <div class="profile">
                <div class="image">
                    <img :src="user.photo" alt="" v-if="user.photo">
                    <img :src="'/user_placeholder.png'" alt="" v-else>
                    <label class="floating" for="fileInput" v-if="optingForEditProfile">
                        <img src="/Floating.png" alt="">
                    </label>
                </div>
                <div class="name mt-3">
                    {{user.fullname}}
                </div>
                <button class="btn btn-primary" @click="optingForEditProfile = true" v-if="!optingForEditProfile">
                    {{$t('ModifyProfile')}}
                </button>
                <br>
                <br>
                <p class="text-success" v-if="success_edit">{{$t('InformationUpdatedSuccessfully')}}</p>
                <p class="text-danger" v-if="error_edit">{{$t('InformationUpdateError')}}</p>
                
                <div class="edit row" v-if="optingForEditProfile">
                    <div class="col-3"></div>
                    <div class="col-6">
                        <div class="group" style="display: none;">
                            <label for="fileInput">{{$t('NewImage')}}</label>
                            <input type="file" class="input" id="fileInput">
                        </div>
                        <div class="group">
                            <label for="name">{{$t('FullName')}}</label>
                            <input type="text" class="input" id="name" v-model="user.fullname" placeholder="Nom et prénom">
                        </div>
                        <div class="group">
                            <label for="email" style="margin-top: 15px !important;">{{$t('Email')}}</label>
                            <input type="email" class="input" id="email" v-model="user.email" placeholder="Email">
                        </div>
                        <div class="group">
                            <label for="phone" style="margin-top: 15px !important;">{{$t('SocialReason')}}</label>
                            <input type="text" class="input" :placeholder="$t('SocialReason')" v-model="user.social_reason">
                        </div>
                        <div class="group">
                            <label for="phone" style="margin-top: 15px !important;">{{$t('Customer.PhoneNumber')}}</label>
                            <input type="text" class="input" v-model="user.phone" disabled>
                        </div>

                        <button class="btn btn-dark mr-2" @click="optingForEditProfile = false" style="background: #888;border: 1px solid #888;">
                            {{$t('Return')}}
                        </button>
                        <button class="btn btn-primary  ml-2" @click="editProfile()">
                            {{$t('Modify')}}
                        </button>
                    </div>
                </div>
            </div>

            <div class="plans" v-if="!optingForEditProfile">
                <div class="title">
                    <span>{{$t('MyPlans')}}&nbsp;:</span>
                </div>

                <div class="plan" v-for="(item, index) in confirmed_tickets" :key="'confirmed_tickets_'+index" @click="goTo('./t/'+item.unique_id)">
                    <div class="content row m-0 p-0">
                        <div class="image col-2">
                            <img :src="item.business_summary.photo" alt="">
                        </div>
                        <div class="data col-7">
                            <span class="name">{{item.business_summary.name}}</span>
                            <span class="address">{{item.business_summary.address}}</span>
                            <span class="services">{{item.services.map((obj)=>{return obj.title}).join(', ')}}</span>
                            <span class="date">
                                {{$t('TicketNumber')}} : {{item.public_identifier}}
                            </span>
                        </div>
                        <div class="status col-3">
                            <!-- <img src="/check.png" alt="">
                            &nbsp;Approuvé -->
                            {{$t('YourTurnIn')}} <br>
                            <span>{{getWaitingTime(item.waiting_time, item.estimatedTimeToSpend)}}</span>
                        </div>
                    </div>
                </div>

                <div class="plan" v-for="(item, index) in confirmed_bookings" :key="'confirmed_booking_'+index">
                    <div class="content row m-0 p-0">
                        <div class="image col-2">
                            <img :src="item.business.photo" alt="">
                        </div>
                        <div class="data col-7">
                            <span class="name">{{item.business.name}}</span>
                            <span class="address">{{item.business.address}}</span>
                            <span class="services">{{item.service_names}}</span>
                            <span class="date">
                                <img src="/Calendar.png" alt="">
                                {{item.start_datetime}}
                            </span>
                        </div>
                        <div class="status col-3">
                            <img src="/check.png" alt="">
                            &nbsp;{{$t('Approved')}}
                        </div>
                    </div>
                </div>

                <div class="loader" v-if="all_ready < 2">
                    <img src="/loader-circle.gif" alt="">
                </div>

                <div class="empty" v-if="all_ready >= 2 && !confirmed_bookings.length && !confirmed_tickets.length">
                    <img src="/empty.png" alt="">
                    <p>{{$t('NoPlansYet')}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import { queueService, bookingService, userService} from "../_services"

export default({
    data:()=>({
        user: null,
        organization_id: '',
        circle_loader: true,
        confirmed_tickets: [],
        confirmed_bookings: [],
        optingForEditProfile: false,
        all_ready: 0,

        error_edit: false,
        success_edit: false
    }),
    mounted(){
        this.user = JSON.parse( localStorage.getItem('user') )
        this.organization_id = this.Config.organization_id
    },
    methods:{
        editProfile(){
            $('#PreLoader').show();
            this.success_edit = false
            this.error_edit = false
            let data = new FormData();

            data.append('fullname', this.user.fullname);
            data.append('email', this.user.email);
            data.append('social_reason', this.user.social_reason?this.user.social_reason:'');
            data.append('_method', 'PUT');
            if(document.getElementById("fileInput").files[0]){
                data.append('photo', document.getElementById("fileInput").files[0]);
            }

            userService.update(data).then(function (data) {
                this.success_edit= true

                let actualUser = JSON.parse(localStorage.getItem('user'));
                actualUser.fullname = data.user.fullname;
                actualUser.email = data.user.email;
                actualUser.photo = data.user.photo;
                actualUser.social_reason = data.user.social_reason;
                localStorage.setItem('user', JSON.stringify(actualUser));
                this.user = actualUser;
            }.bind(this)).catch(function () {
                this.error_edit= true
            }.bind(this)).finally(function () { 
                $('#PreLoader').hide();
            }.bind(this));
        },
        goTo(url){
            window.location.href = url
        },
        getWaitingTime(seconds, mines_minutes){
            let waiting_seconds= seconds-(mines_minutes*60);
            let h= Math.floor(waiting_seconds/3600);
            let m= Math.floor( (waiting_seconds-3600*h)/60);
            let s= Math.floor(waiting_seconds%60);
            return ((h!=0)?h+'h ':'')+m+' '+this.$t('Min')+' ';
        },
        initPage(){
            queueService.getConfirmed().then(function(data){
                this.confirmed_tickets= data.tickets.data.filter((obj)=>{
                    if(obj.business_summary.organization_id==this.organization_id || this.organization_id==='' || (!this.organization_id && obj.business_summary.id==this.Config.default_business_id) ){
                        return true;
                    }
                    return false
                });
            }.bind(this)).finally(function(){
                this.all_ready++
                this.circle_loader= false
            }.bind(this))

            bookingService.getConfirmed().then(function(data){
                this.confirmed_bookings= data.bookings.data.filter((obj)=>{
                    if(obj.business.organization_id==this.organization_id || this.organization_id==='' || (!this.organization_id && obj.business_summary.id==this.Config.default_business_id)){
                        obj.start_datetime= moment(String(obj.start_datetime)).format('DD MMM YYYY HH:mm')
                        return true
                    }
                    return false;
                });
            }.bind(this)).finally(function(){
                this.all_ready++
                this.circle_loader= false
            }.bind(this))
        },
        show() {
            $('#ProfileModal').css('right', 0)
            $('#Profile > .overlay').fadeIn()
            this.initPage()
        },
        hide() {
            $('#ProfileModal').css('right', '-600px')
            $('#Profile > .overlay').fadeOut()
        },
        logout(){
            localStorage.removeItem('user')
            window.location.href = ''
        },
    }
})
</script>


<style lang="scss" scoped>
    #Profile{
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
            width: 600px;
            position: fixed;
            z-index: 999999;
            top: 0;
            right: -600px;
            background-color: #fff;
            overflow-x: hidden;
            transition: 0.3s;
            padding-top: 20px;
            text-align:left;
            .profile{
                text-align: center;
                margin-top: 20px;
                .image{
                    img{
                        width: 75px;
                        height: 75px;
                        border-radius: 100%;
                    }
                    .floating{
                        cursor: pointer;
                        img{
                            width: 25px;
                            height: 25px;
                            position: absolute;
                            margin-left: -30px;
                            margin-top: 15px;
                        }
                    }
                }
                .name{
                    font-size: 15px;
                    font-weight: 500;
                }
                button{
                    margin-top: 20px;
                }
                .edit{
                    .group{
                        margin-bottom: 10px;
                    }
                    label{
                        display: block;
                        font-size: 14px;
                        float: left;
                        font-weight: bold;
                    }
                    .input{
                        height: 35px;
                        border-radius: 5px;
                        width: 100%;
                        border: 1px solid #ddd;
                        padding: 0 10px;
                        font-size: 13px;
                    }
                    .input[type=file]{
                        padding-top: 4px;
                    }
                    button{
                        margin-top: 20px;
                    }
                }
            }
            .plans{
                padding: 20px 30px;
                .loader{
                    width: 100%;
                    text-align: center;
                    margin-top: 20px;
                    img{
                        width: 50px;
                    }
                }
                .empty{
                    width: 100%;
                    text-align: center;
                    margin-top: 20px;
                    img{
                        width: 150px;
                    }
                }
                .title{
                    width: 15px;
                    width: 100px;
                    font-size: 15px;
                    color: var(--special-font);
                    border-bottom: 3px solid var(--primary);
                    border-radius: 2px;
                    font-weight: 600;
                }
                .plan{
                    margin-top: 20px;
                    .content{
                        transition: .3s;
                        border-radius: 5px;
                        cursor: pointer;
                        .image{
                            text-align: center;
                            max-width: 75px !important;
                            img{
                                border-radius: 5px;
                                width: 100%;
                            }
                        }
                        .data{
                            padding: 0 20px;
                            .name{
                                font-size: 13px;
                                font-weight: 600;
                                display: block;
                            }
                            .address{
                                display: block;

                            }
                            .services{
                                color: var(--secondary);
                                display: block;
                            }
                            .date{
                                font-weight: bold;
                                font-size: 11px;
                            }
                        }
                        .status{
                            display: inline-block;
                            text-align: center;
                            border-left: 1px solid #ddd;
                            color: var(--success);
                            font-weight: bold;
                            padding: 25px 20px;
                        }
                    }
                    .content:hover{
                        // background: #eee;
                    }
                }
            }
        }

        .sidenav .logout{
            color: var(--special-font);
            float: right;
            right: 20px;
            font-size: 20px;
            position: absolute;
            cursor: pointer;
        }

        .sidenav .closebtn {
            color: var(--special-font);
            float: right;
            left: 20px;
            top: 5px;
            font-size: 20px;
            position: absolute;
            font-size: 36px;
        }
        // .sidenav .closebtn {
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     font-size: 36px;
        //     margin-left: 50px;
        //     margin-bottom: 10px;
        //     text-align: center;
        //     padding: 0 10px;
        //     border-radius: 5px;
        // }

        @media screen and (max-height: 450px) {
            .sidenav {padding-top: 15px;}
            .sidenav a {font-size: 18px;}
        }
        @media only screen and (max-width: 800px) {
            .sidenav {width: 100%;right: -100%;}
        }
        button{
            background: var(--primary);        
            color: var(--primary-font); 
            border-radius: 10px;
            font-size: 15px;   
            font-weight: 300;
            padding: 10px 20px;
        }
        button:hover{
            background: var(--primary-hover);        
            color: var(--primary-font);        
        }
    }
</style>