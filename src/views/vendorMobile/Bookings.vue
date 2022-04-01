<template>
    <div id="LandingBookingsMobile" v-if="Vendor">
        <div v-if="Vendor.departments.length==1">{{initSelected()}}</div>
        
        <div id="Step1" class="m-0 p-0 col-md-12" v-if="step==1">
            <div class="header row w-100" v-if="selected.show_dep_and_members">
                <div class="col-12 departments">
                    <label for="departments">
                        <template v-if="$i18n.locale=='en'">{{Config.options.choose_department_label.en}}</template>
                        <template v-else-if="$i18n.locale=='fr'">{{Config.options.choose_department_label.fr}}</template>
                        <template v-else-if="$i18n.locale=='ar'">{{Config.options.choose_department_label.ar}}</template>
                        <template v-else>{{Config.options.choose_department_label.default}}</template>
                    </label>
                    <v-select 
                        :options="Vendor.departments" 
                        :disabled="Vendor.departments.length<=1"
                        v-model="selected.department"
                        label="name"
                        class="select dep_select"
                        id="departments"
                    ></v-select>
                </div>
                <div class="col-12 mt-5 members"  v-if="selected.department && selected.department.members && selected.department.dep_members.length > 0" style="margin-left: -5px;">
                    <label for="member">
                        <template v-if="$i18n.locale=='en'">{{Config.options.choose_member_label.en}}</template>
                        <template v-else-if="$i18n.locale=='fr'">{{Config.options.choose_member_label.fr}}</template>
                        <template v-else-if="$i18n.locale=='ar'">{{Config.options.choose_member_label.ar}}</template>
                        <template v-else>{{Config.options.choose_member_label.default}}</template>
                    </label>
                    
                    <v-select 
                        :options="selected.department.dep_members" 
                        :disabled="selected.department.dep_members.length<=1"
                        placeholder="--"
                        v-model="selected.member"
                        label="fullname"
                        class="select member_select"
                        id="member"
                        v-if="selected.department"
                    ></v-select>
                    <v-select 
                        :disabled="true"
                        v-model="selected.member"
                        label="fullname"
                        class="select member_select"
                        v-else
                    ></v-select>
                </div>
            </div>
            <div class="services" v-if="selected.department">
                <label for="member">{{$t('ChooseServices')}}</label>
                <div class="search">
                    <input type="search" :placeholder="$t('FindYourService')">
                    <button class="btn">
                        <font-awesome-icon class="icon" icon="search" /> 
                    </button>
                </div>

                <div class="service" v-if="selected.department.services.length" v-for="service in selected.department.services" :key="'depService'+service.id">
                    <div class="group">
                        <label :for="'queue_service'+service.id" style="max-width: 80%;">{{service.title}}</label>
                        <!-- <input type="checkbox" name="service" :id="'queue_service'+service.id"> -->
                        <vs-checkbox class="checkbox font" :id="'queue_service'+service.id" :vs-value="service" v-model="selected.services">
                        </vs-checkbox>
                    </div>
                </div>
                <div class="service" v-if="!selected.department.services.length" v-for="service in Vendor.services" :key="'depService2'+service.id">
                    <div class="group">
                        <label :for="'queue_service'+service.id">{{service.title}}</label>
                        <!-- <input type="checkbox" name="service" :id="'queue_service'+service.id"> -->
                        <vs-checkbox class="checkbox font" :id="'queue_service'+service.id" :vs-value="service" v-model="selected.services">
                        </vs-checkbox>
                    </div>
                </div>
            </div>
        </div>

        <div id="Step2" class="w-100 m-0 p-0" v-else-if="step==2">
            <div class="section-loader" v-if="loading_dates">
                <img src="/loader-circle.gif" alt="">
            </div>
            <div class="" v-else>
                <div class="calendar text-center">
                    <label for="member">{{$t('ChooseDateAndSlots')}}</label>
                    <datepicker
                        class="datePicker"
                        v-model="selected.date"
                        :format="'yyyy MM dd'"
                        :disabled-dates="datepicker_config.disabled_dates"
                        :monday-first="true"
                        :inline="true"
                        :language="datepicker_config.language"
                        @input="getAvailableSlots()"
                    ></datepicker>
                </div>
                <div class="slots">
                    <div class="section-loader" v-if="loading_slots">
                        <img src="/loader-circle.gif" alt="">
                    </div>
                    <div v-else>
                        <div 
                            v-for="slot in booking_slots" :key="'slots'+slot.slot"
                            class="slot" 
                            :class="
                                slot.active==1?
                                    slot.slot==selected.slot?
                                        'slot_active slot_selected'
                                    :
                                        'slot_active'
                                :'slot_disabled'
                            "
                            @click="selected.slot = slot.slot"
                            v-show="booking_slots.length"
                        >
                            {{slot.slot}}
                        </div>
                        <div class="slot slot-danger" v-if="!booking_slots.length">
                            {{$t('NoSlotsYet')}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="buttons">
            <button class="button mr-2" @click="backBtn()">
                {{$t('Return')}}
            </button>

            <button class="button button-filled ml-2" @click="step++; specifyBookingDays()" v-if="selected.services.length && step==1">
                {{$t('Next')}}
            </button>
            <button class="button button-filled ml-2" v-else-if="step==1" style="cursor: not-allowed;opacity: .7;">
                {{$t('Next')}}
            </button>

            <button class="button button-filled ml-2" @click="bookAppointment()" v-if="selected.services.length && selected.slot && step==2">
                {{$t('Confirm')}}
            </button>
            <button class="button button-filled ml-2" v-else-if="step==2" style="cursor: not-allowed;opacity: .7;">
                {{$t('Confirm')}}
            </button>
        </div>
        <Modal 
            :active="modal.active"
            :type="modal.type"
            :title="modal.title"
            :hint="modal.hint"
            :message="modal.message"
            :confirmationButton="modal.confirmationButton"
            @confirm="ModalConfirmed"
        />
        <Modal 
            :active="danger_modal.active"
            :type="danger_modal.type"
            :title="danger_modal.title"
            :hint="danger_modal.hint"
            :message="danger_modal.message"
            :confirmationButton="danger_modal.confirmationButton"
            @confirm="DangerModalConfirmed"
        />
    </div>
</template>

<script>
import $ from 'jquery'
import { vendorsService,bookingService } from '/src/_services'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker';
import {en, ar, fr} from 'vuejs-datepicker/dist/locale'

import Modal from '../modals/Popup.vue'

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.removeDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

export default({
    data:()=>({
        loading: true,
        loading_dates: false,
        loading_slots: false,
        step: 1,
        datepicker_config:{
            today: moment().format('YYYY-MM-DD'),
            language: fr,
            disabled_dates: {
                to: new Date().removeDays(1),
                from: null,
                days: [],
                ranges: []
            }
        },
        holidays: [],
        booking_days: [],
        booking_slots: [],
        selected: {
            show_dep_and_members: true,

            department: null,
            member: null,
            services: [],
            date: new Date(),
            slot: null
        },
        modal: {
            active: false,
            type: 'success',
            title: 'Rendez-vous pris avec succès',
            hint: '10:30, Le 30 Janvier 2020',
            message: 'Rendez-vous pris avec succès, nous vous avons déjà envoyé un SMS de confirmation et nous vous le rappellerons par SMS quelques heures avant le rendez-vous. Merci',
            confirmationButton: 'Continuer'
        },
        danger_modal: {
            active: false,
            type: 'danger',
            title: 'Ouups',
            hint: 'Une erreur s\'est produite',
            message: 'Une erreur s\'est produite, veuillez réessayer plus tard ou contactez-nous',
            confirmationButton: 'Fermer'
        }
    }),
    components:{
        Datepicker,
        Modal
    },
    props:{
        Vendor: Object,
        User: Object
    },
    mounted(){
        if(this.$i18n.locale=='en'){
            this.datepicker_config.language = en
        }else if(this.$i18n.locale=='ar'){
            this.datepicker_config.language = fr
        }

        this.modal.title = this.$t('AppointmentBookedSuccessffullyTitle')
        this.modal.message = this.$t('AppointmentBookedSuccessffullyMessage')
        this.modal.confirmationButton = this.$t('AppointmentBookedSuccessffullyButton')

        this.danger_modal.title = this.$t('AppointmentBookFailedTitle')
        this.danger_modal.hint = this.$t('AppointmentBookFailedHint')
        this.danger_modal.message = this.$t('AppointmentBookFailedMessage')
        this.danger_modal.confirmationButton = this.$t('AppointmentBookFailedButton')
    },
    methods:{
        DangerModalConfirmed(){
            this.danger_modal.active = false
        },
        ModalConfirmed(){
            window.location.href = '/'
        },
        bookAppointment(){
            $('#PreLoader').show();
            
            let services = this.selected.services.map((service)=>{
                return service.id
            });

            let data = new FormData();
            data.append('business_id', this.Vendor.id);
            data.append('services', services.join(','));
            data.append('department_id', this.selected.department ? this.selected.department.id : null);
            data.append('member_id', this.selected.member?this.selected.member.id:-1 );
            data.append('start_datetime', moment(this.selected.date).format('YYYY-MM-DD')+' '+this.selected.slot);
            data.append('end_datetime', moment(this.selected.date).format('YYYY-MM-DD')+' '+this.selected.slot);
            
            data.append('_method', 'PUT');

            bookingService.createBooking(data).then(function(data) {
                this.modal.active = true
                this.modal.hint = 
                    this.selected.slot 
                    +', '
                    + moment(this.selected.date).format('dddd')
                    + ' '
                    + moment(this.selected.date).format('DD MMMM YYYY')

                this.selected.department= null
                this.selected.member= null
                this.selected.slot= null
                this.selected.services= []
            }.bind(this)).finally(function() { 
                $('#PreLoader').hide();
            }.bind(this)).catch(function() {
                this.danger_modal.active = true
            }.bind(this));
        },
        getAvailableSlots(){
            this.loading_slots = true
            this.selected.slot = null

            let data = {
                business_id: this.Vendor.id,
                date: moment(this.selected.date).format("YYYY-MM-DD"),
                department: this.selected.department ? this.selected.department.id : null,
                selected_member: this.selected.member?this.selected.member.id:-1,
                user: (this.User)?this.User.id:null,
            };

            bookingService
                .getAvailability(data)
                .then(
                function(data) {
                    this.booking_slots = data.slots;
                    this.loading_slots = false;
                }.bind(this)
                )
                .catch(function(ex) {
                    this.booking_slots = [];
                    this.loading_slots = false;
                }.bind(this));
        },
        specifyBookingDays(){
            this.loading_dates = true
            
            if(this.selected.member){
                this.booking_days = this.selected.member.booking_days
            }else if(this.selected.member){
                this.booking_days = this.selected.department.booking_days
            }else{
                this.booking_days = this.Vendor.booking_days
            }

            //Disable non-working days
            this.datepicker_config.days = []

            this.booking_days.forEach((obj, index) => {
                if (obj.active == 0) {
                    this.datepicker_config.disabled_dates.days.push(index == 6 ? 0 : index+1);
                }
            });

            //Disable Holidays
            this.datepicker_config.ranges = []

            this.Vendor.holidays.map((obj)=>{
                if(obj.member_id==null || obj.member==null || obj.member_id==this.selected.member.id){
                    let range = {}
                    range["from"] = new Date(obj.start_date)
                    range["to"] = new Date(obj.end_date)
                    this.datepicker_config.disabled_dates.ranges.push(range)
                }
            })

            //Book J-?
            this.datepicker_config.disabled_dates.from = null
            
            if(this.Vendor.max_booking_days_before>=0){
                let i = 0;
                let searched_day= new Date().getDay()
                let max_booking_days_before= this.Vendor.max_booking_days_before
                while(i < this.Vendor.max_booking_days_before){
                    if( this.booking_days[searched_day].active==0 ){
                        max_booking_days_before++
                    }else{
                        i++
                    }
                    searched_day= (searched_day == 6 )? 0 : searched_day+1;
                }
                this.datepicker_config.disabled_dates.from = new Date().addDays(max_booking_days_before);
            }

            this.loading_dates = false
            this.getAvailableSlots()
        },
        backBtn(){
            this.selected.services = []
            this.selected.date = new Date()
            this.selected.slot = null

            if(this.step>1){
                this.step--
                this.initSelected()
            }else{
                this.goBack()
            }
        },
        goBack(){
            this.$emit('goBack')
        },
        initSelected(){
            if(this.Vendor.departments.length==1){
                this.selected.department = this.Vendor.departments[0]
                if( this.selected.department.dep_members == 1 ){
                    this.selected.member = this.selected.department.dep_members[1]
                    this.selected.show_dep_and_members = false
                }else if( this.selected.department.dep_members == 0 ){
                    this.selected.member = null
                    this.selected.show_dep_and_members = false
                }
            }
        },
    }
})
</script>

<style lang="scss">
    .vdp-datepicker {
        position: relative;
        text-align: center;
        margin-left: 50%;
        transform: translate(-150px, 0px);
    }
    .vs--searchable .vs__dropdown-toggle {
        height: 40px !important;
    }
    .select{
        z-index: 999;
    }
    ul{
        z-index: 9999990 !important;
        li{
            z-index: 9999999 !important;
        }
    }

    .datetime-picker input[data-v-a46a390c] {
        width: 150px;
        height: 38px;
    }
    
    #LandingBookingsMobile{
        padding: 15px 0px 15px 30px;
        overflow-y: hidden !important;
        div{
            .header{
                div{
                    label{
                        color: var(--primary);
                        font-style: normal;
                        font-weight: 600;
                        font-size: 15px;
                        margin-left: 5px;
                    }
                }
                div:first-child{
                    padding-right: 5px;
                }     
                div:last-child{
                    padding-left: 5px;
                }         
            }
            
            .services{
                width: 100%;
                margin-top: 30px;
                label{
                    color: var(--primary);
                    font-style: normal;
                    font-weight: 600;
                    font-size: 15px;
                    margin-left: 5px;
                }
                .search{
                    display: flex;
                    width: 100%;
                    margin-bottom: 30px;
                    margin-top: 5px;
                    input{
                        height: 40px;
                        width: 100%;
                        border: 1px solid #ddd;
                        padding: 0 10px;
                        border-radius: 5px 0 0 5px;
                    }
                    button{
                        width: 40px;
                        height: 40px;
                        border-radius: 0 5px 5px 0;
                        background: var(--primary);
                        color: var(--primary-font);
                        outline: none;
                        outline: hidden;
                    }
                    button:hover{
                        background: var(--primary-hover);
                    }
                }

                .service{
                    margin-top: 10px;
                    // padding: 0 10px;
                    label{
                        font-size: 14px;
                        letter-spacing: 1px;
                        cursor: pointer;
                    }
                    .checkbox{
                        float: right;
                        cursor: pointer;
                    }
                    .vs-checkbox-primary input:checked+.vs-checkbox{
                        background: var(--primary);
                        border-color: var(--secondary);
                        outline-color: var(--secondary);
                        outline: 2px solid #fff !important;
                        border: none;
                        padding-top: 3px;
                    }
                    
                    .vs-checkbox--check .vs-icon{
                        /* color: #054479 !important; */
                        font-weight: bold;
                    }
                }
            }

            .calendar{
                text-align: center !important;
                label{
                    color: var(--primary);
                    font-style: normal;
                    font-weight: 600;
                    font-size: 15px;
                }
            }
            .slots{
                margin-top: 30px;
                margin-bottom: 10px;
                width: 100%;
                .section-loader{
                    width: 100%;
                    text-align: center;
                    img{
                        width: 50px;
                    }
                }
                div{
                    text-align: center;
                    .slot{
                        display: inline-block;
                        background: #fff;
                        font-size: 14px;
                        border-radius: 20px;
                        border: 1px solid var(--special-font);
                        color: var(--special-font);
                        transition: .3s;
                        padding: 7px 20px;
                        margin-bottom: 10px;
                        letter-spacing: 1px;
                        margin-right: 10px;
                        cursor: pointer;
                    }
                    .slot:hover{
                        transform: scale(1.05);
                    }
                    .slot_disabled{
                        background: #888;
                        color: #fff;
                        cursor: not-allowed;
                        pointer-events: none;
                    }
                    .slot_selected{
                        background: var(--secondary);
                        color: var(--secondary-font);
                        border: 1px solid var(--secondary);
                    }
                    .slot-danger{
                        background: var(--danger);
                        color: var(--danger-font);
                        border: 1px solid var(--danger);
                    }
                }
            }
        }

        .buttons{
            display: flex;
            justify-content: center;
            width: 100%;
            padding: 20px 0;
            z-index: 99;
            margin-left: -15px;
            .button{
                border: 3px solid var(--primary);
                border-radius: 100px;
                height: 40px;
                transition: .3s;
                color: var(--primary);
                background: #fff;
                font-size: 15px;
                width: 200px;
                z-index: 99;
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
</style>