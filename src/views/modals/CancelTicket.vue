<template>
    <div class="loading-wrapper" v-if="isActive">
        <div :class="'loading-popup popup-' + type">
            <div class="h-100 m-5 align-items-center text-center m-0">
                <div class="row">
                    <div class="col align-items-center d-flex" style="justify-content: center;">
                        <div class="text-left d-inline-block">
                            <h2 class="popup-title">{{$t('DeleteTicket')}}</h2>
                            <span class="message" style="font-size: 13px;">{{$t('irreversible')}}</span>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-4">
                    <span class="message">{{$t('ConfirmDeleteTicket')}}</span>
                </div>

                <div class="buttons">
                    <button class="btn-confirm btn-cancel" @click="confirm()">{{$t('Confirm')}}</button>
                    <button class="btn-cancel" @click="cancel()">{{$t('Cancel')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoadingPopup',
        props: {
            rank: Number,
            active: Boolean,
            type: String,
        },
        methods: {
            confirm(){
                this.$emit('confirm');
            },
            cancel(){
                this.$emit('cancel');
            }
        },
        computed: {
            isActive(){
                return this.active;
            }
        }
    }
</script>

<style>
    .loading-wrapper{
        background: rgba(0, 0, 0, 0.70);
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 9999999999999999999999999999998;
    }

    .loading-popup{
        width: 90%;
        min-width: 320px;
        max-width: 500px;
        background: #ffffff;
        border-radius: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding-bottom: 50px;
        color: #264076;
        z-index: 9999999999999999999999999999999;
    }

    .loader{
        width: 50px;
        height: 50px;
    }

    .popup-success .popup-title {
        color: #89d24c !important;
        margin-bottom: 0px;
        font-size: 20px !important;
        display: flex;
    }

    .popup-success  .icon {
        width: 50px;
        margin: 10px 10px;
    }

    .popup-success  .message {
        color: #444;
        font-weight: lighter;
        font-size: 13px;
    }

    .popup-success  .hint {
        color: #333;
        font-weight: bold;
        font-size: 16px;
    }

    .popup-success .btn-confirm {
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0px 0px 20px 20px;
        padding: 15px;
        width: 100%;
        border: none;
        background: #89d24c;
        color: #fff;
        font-weight: 400;
        font-size: 22px;
    }

    .popup-success .btn-confirm:not(:disabled):not(.disabled):active, .btn-confirm:not(:disabled):not(.disabled).active, .show > .btn-confirm.dropdown-toggle {
        color: #fff;
        background-color: #72b53a;
        border-color: #72b53a;
    }

    .popup-success .btn-confirm:focus, .btn-confirm.focus {
        box-shadow: none;
    }

    .popup-danger .popup-title {
        color: #DC3545 !important;
        margin-bottom: 0px;
        font-size: 20px !important;
        display: flex;
    }

    .popup-danger  .icon {
        width: 50px;
        margin: 10px 10px;
    }

    .popup-danger  .message {
        color: #444;
        font-weight: lighter;
        font-size: 13px;
    }

    .popup-danger  .hint {
        color: #333;
        font-weight: bold;
        font-size: 16px;
    }

    .popup-danger .btn-cancel {
        position: absolute;
        bottom: 0;
        left: 0;
        /* border-radius: 0px 0px 20px 20px; */
        padding: 15px;
        width: 50%;
        border: none;
        background: #DEE;
        color: #333;
        font-weight: 400;
        font-size: 22px;
        border-radius: 0 0 0 20px;
    }
    .popup-danger .btn-confirm{
        background: #DC3545;
        color: #fff;
        left: auto !important;
        right: 0 !important;
        border-radius: 0 0 20px 0  !important;
    }

    .popup-danger .btn-confirm:not(:disabled):not(.disabled):active, .btn-confirm:not(:disabled):not(.disabled).active, .show > .btn-confirm.dropdown-toggle {
        color: #fff;
        background-color: #DC3545;
        border-color: #DC3545;
    }

    .popup-danger .btn-confirm:focus, .btn-confirm.focus {
        box-shadow: none;
    }

</style>