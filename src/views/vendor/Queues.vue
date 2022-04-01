<template>
    <div id="LandingQueues" class="row" v-if="Vendor">
        <div v-if="Vendor.queues.length==1">{{checkQueuesLength()}}</div>
        <div class="queue row w-100" v-for="queue in Vendor.queues" :key="'queue'+queue.id" @click="getQueueData(queue.id);selected_queue=queue" v-if="!selected_queue || selected_queue.id==queue.id">
            <div class="col-md-11 left">
                <b class="name">{{queue.title}}</b>
                <div class="infos">
                    <div class="info">
                        <font-awesome-icon class="icon" icon="clock" /> 
                        {{queue.time_to_wait}}
                    </div>
                    <div class="info ml-5">
                        <font-awesome-icon class="icon" icon="user" /> 
                        {{queue.totalWaiting}} {{$t('Waiting')}}
                    </div>
                </div>
            </div>
            <div class="col-md-1 right text-center">
                <img class="icon" :src="'/Queue-Icon '+queue.iconImgNumber+'.svg'" alt="">
            </div>
        </div>

        <div class="services" v-if="selected_queue">
            <div class="search">
                <input type="search" :placeholder="$t('FindYourService')">
                <button class="btn">
                    <font-awesome-icon class="icon" icon="search" /> 
                </button>
            </div>
            <div class="section-loader" v-if="loading">
                <img src="/loader-circle.gif" alt="" style="width: 30px;">
            </div>
            <div class="service" v-for="service in queue_services" :key="'queueService'+service.id">
                <div class="group">
                    <label :for="'queue_service'+service.id">{{service.title}}</label>
                    <!-- <input type="checkbox" name="service" :id="'queue_service'+service.id"> -->
                    <vs-checkbox class="checkbox font" :id="'queue_service'+service.id" :vs-value="service" v-model="selected_services">
                    </vs-checkbox>
                </div>
            </div>
        </div>

        <div class="buttons">
            <button class="button mr-2" @click="goBack()">
                {{$t('Return')}}
            </button>
            <button class="button button-filled ml-2" @click="joinQueue()" v-if="selected_queue && selected_services.length">
                {{$t('JoinQueue')}}
            </button>
            <button class="button button-filled ml-2" v-else style="cursor: not-allowed;opacity: .7;">
                {{$t('JoinQueue')}}
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
            :active="already_have_ticket_modal.active"
            :type="already_have_ticket_modal.type"
            :title="already_have_ticket_modal.title"
            :hint="already_have_ticket_modal.hint"
            :message="already_have_ticket_modal.message"
            :confirmationButton="already_have_ticket_modal.confirmationButton"
            @confirm="AlreadyHaveTicketModalConfirmed"
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
import Agency from '../components/Agency.vue'
import { queueService } from '/src/_services'
import moment from 'moment'
import Modal from '../modals/Popup.vue'

export default({
    data:()=>({
        loading: true,
        active_tab: 'about',
        selected_queue: null,
        selected_services: [],
        queue_services: [],
        new_ticket: null,
        has_ticket: true,

        modal: {
            active: false,
            type: 'success',
            title: 'Ticket pris avec succès',
            hint: '',
            message: 'Nous vous avons envoyé un SMS où vous pouvez suivre votre billet via votre téléphone en temps réel, Merci.',
            confirmationButton: 'Visiter mon ticket'
        },
        already_have_ticket_modal: {
            active: false,
            type: 'danger',
            title: 'Erreur est survenue',
            hint: 'Vous avez déja une ticket',
            message: 'Vous avez déjà un ticket réservé dans cette file d\'attente, veuillez cliquer ci-dessous pour voir votre ticket.',
            confirmationButton: 'Visiter mon ticket'
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
        Agency,
        Modal
    },
    props:{
        Vendor: Object
    },
    mounted(){
        this.modal.title = this.$t('TicketBookedSuccessffullyTitle')
        this.modal.message = this.$t('TicketBookedSuccessffullyMessage')
        this.modal.confirmationButton = this.$t('TicketBookedSuccessffullyButton')

        this.danger_modal.title = this.$t('TicketBookFailedTitle')
        this.danger_modal.hint = this.$t('TicketBookFailedHint')
        this.danger_modal.message = this.$t('TicketBookFailedMessage')
        this.danger_modal.confirmationButton = this.$t('TicketBookFailedButton')

        this.already_have_ticket_modal.title = this.$t('AlreadyHaveTicketBookFailedTitle')
        this.already_have_ticket_modal.hint = this.$t('AlreadyHaveTicketBookFailedHint')
        this.already_have_ticket_modal.message = this.$t('AlreadyHaveTicketBookFailedMessage')
        this.already_have_ticket_modal.confirmationButton = this.$t('AlreadyHaveTicketBookFailedButton')
    },
    methods:{
        getQueueData(queue_id){
            this.loading = true
            queueService.getQueueById(queue_id).then(function(data){
                this.queue_services= data.services
            }.bind(this)).finally(function(){
                this.loading = false
            }.bind(this))
        },
        DangerModalConfirmed(){
            this.danger_modal.active = false
        },
        AlreadyHaveTicketModalConfirmed(){
            window.location.href = '/t/'+this.new_ticket.unique_id
        },
        ModalConfirmed(){
            window.location.href = '/'
        },
        joinQueue(){
            $('#PreLoader').show();
            let payload = { services: this.selected_services.map(function (obj) { return obj.id; }).join(','), business_id: this.Vendor.id};

            queueService.createTicket(this.selected_queue.id, payload).then(function(data) {
                if (data.status == "success") {

                    $('#PreLoader').show();
                    queueService.getConfirmed().then(function(data){
                        let already_has_ticket= false;

                        let ticket= data.tickets.data.map((obj)=>{

                            var duration = moment.duration( moment(new Date()).diff( moment(String(obj.checkinDate+' '+obj.checkinTime) ) ) );
                            var minutes = duration.asMinutes();

                            if(obj.business_summary.organization_id==this.Config.organization_id || this.Config.organization_id==''){
                                if( minutes>2 && !already_has_ticket){
                                    already_has_ticket= already_has_ticket || (obj.queue_line_id==this.selected_queue.id)
                                    if(already_has_ticket){
                                        this.new_ticket= obj;
                                    }
                                }
                                return obj;
                            }
                        });
                        
                        if(already_has_ticket){
                            // this.has_ticket= true
                            // window.location.href= '/t/'+ticket.unique_id
                            this.already_have_ticket_modal.active = true
                        }else{
                            ticket= ticket[ticket.length-1]
                            this.new_ticket= ticket;
                            window.location.href= '/t/'+ticket.unique_id
                        }
                    }.bind(this)).catch(function(){
                        this.danger_modal.active = true
                    }.bind(this)).finally(function() {
                        $('#PreLoader').hide();
                    }.bind(this));
                }else{
                    $('#PreLoader').hide();
                }              
            }.bind(this)).catch(function(data) {
                $('#PreLoader').hide();
                this.danger_modal.active = true
            }.bind(this)).finally(function() {
            }.bind(this))
        },
        goBack(){
            if(this.selected_queue){
                this.selected_queue = null
                this.selected_services = []
                this.queue_services = []
            }else{
                this.$emit('goBack')
            }
        },
        checkQueuesLength(){
            if(this.Vendor.queues.length==1){
                this.selected_queue = this.Vendor.queues[0]
            }
        },
    }
})
</script>

<style lang="scss">
    #LandingAgency{
        overflow-y: hidden !important;
        .queue{
            box-shadow: 0 0 2px 1px #ddd;
            border-radius: 5px;
            margin-bottom: 20px;
            padding: 15px 20px;
            transition: .3s;
            cursor: pointer;
            .left{
                .name{
                    font-size: 15px;
                    color: #444;
                    letter-spacing: 1px;
                }
                .infos{
                    display: flex;
                    margin-top: 5px;
                    .info{
                        font-size: 13px;
                        color: #666;
                        .icon{
                            margin-right: 5px;
                        }
                    }
                }
            }

            .right{
                font-size: 18px;
                color: #666;
                margin-top: 10px;
                .icon{
                    transition: .3s;
                }
            }
        }
        .queue:hover{
            transform: scale(1.02);
            box-shadow: 0 0 3px 2px #ddd;
        }
        .queue:hover > .right .icon{
            // margin-right: -20px;
        }
        .services{
            width: 100%;
            margin-left: -15px;
            .search{
                display: flex;
                width: 100%;
                margin-top: 40px;
                margin-bottom: 20px;
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
                padding: 0 10px;
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

        .buttons{
            display: flex;
            justify-content: center;
            width: 100%;
            padding: 20px 0;
            .button{
                border: 3px solid var(--primary);
                border-radius: 100px;
                height: 40px;
                transition: .3s;
                color: var(--primary);
                background: #fff;
                font-size: 15px;
                width: 200px;
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