<template>
    <div id="LandingLogin" class="row">
        <div class="overlay" @click="hide"></div>
        <div class="modal LoginModal">
            <div class="group">
                <b>{{$t('Auth.EnterPhoneNumber')}}</b>
                <input type="tel" id="login" v-model="phone" :placeholder="$t('Customer.PhoneNumber')" :maxlength="Config.options.phone_max_length" :disabled="optForVerification">
                <span class="text-danger" v-if="errors.length_error">
                    {{$t('LoginMaxLength')}}
                    {{Config.options.phone_max_length}}
                </span>
            </div>

            <div class="Verify" v-if="optForVerification">
                <div class="group">
                    <b>{{$t('EnterTheCode')}}</b>
                </div>

                <div class="code">
                    <input 
                        type="text" 
                        :id="'code'+index" 
                        placeholder="-" 
                        v-for="index in 6" 
                        :key="index"
                        maxlength="1"
                        @keyup="nextNumber(index)"
                    />
                </div>
                <div class="text-danger text-center mt-2" v-if="errors.wrong_code">{{$t('WrongCode')}}</div>
            </div>
            
            <div class="footer">
                <div class="text" v-html="$t('LoginModalSpeech')"></div>

                <button class="btn" @click="login()" v-if="!loading && !optForVerification">{{$t('Auth.Login')}}</button>
                <button class="btn" @click="verify()" v-else-if="!loading && optForVerification">{{$t('LoginVerifyButton')}}</button>
                <button class="btn" v-else>
                    <font-awesome-icon class="icon spin-icon" icon="spinner" /> 
                </button>
            </div>
        </div>

        <div class="modal RegisterModal">
            <div class="group">
                <b>{{$t('PleaseRegister')}}</b>
                <input type="tel" id="login" v-model="registerForm.phone" :placeholder="$t('Customer.PhoneNumber')" :maxlength="Config.options.phone_max_length">
            </div>
            <div class="group mt-3">
                <b>{{$t('FullName')}}</b>
                <input type="text" id="fullname" v-model="registerForm.name" :placeholder="$t('FullName')" minlength="3">
            </div>
            <div class="group mt-3">
                <b>{{$t('Email')}}</b>
                <input type="tel" id="login" v-model="registerForm.email" :placeholder="$t('Email')">
            </div>
            <div class="group mt-3">
                <b>{{$t('SocialReason')}}</b>
                <input type="tel" id="login" v-model="registerForm.social_reason" :placeholder="$t('SocialReason')">
            </div>
            <div class="group mt-3">
                <vs-checkbox 
                    class="checkbox font" 
                    :id="'terms'" 
                    :vs-value="true" 
                    v-model="registerForm.terms">
                    {{$t('AcceptTerms')}}
                </vs-checkbox>
            </div>


            <div class="footer">
                <button class="btn" @click="register()" v-if="!loading">{{$t('Auth.CreateAnAccount')}}</button>
                <button class="btn" v-else>
                    <font-awesome-icon class="icon spin-icon" icon="spinner" /> 
                </button>
            </div>
            <div class="text-danger text-center mt-3" v-if="errors.register">{{$t('ErrorOccured')}}</div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import { userService } from '/src/_services'

export default({
    data:()=>({
        loading: false,
        phone: '',
        phone_prefix: null,
        optForVerification: false,
        registerForm: {
            phone: '',
            name: '',
            email: '',
            social_reason: '',
            terms: null,
            error: false
        },
        errors: {
            length_error: false,
            wrong_code: false,
            register: false
        }
    }),
    components:{
    },
    mounted(){
    },
    methods:{
        verify(){
            let full_code = ''
            this.loading = true
            for(var i=1; i<=6; i++){
                full_code += $('#code'+i).val()
            }

            let data = {
                phone: this.phone.toString().replace(/ /g, ""),
                phone_prefix: this.Config.options.phone_default_prefix,
                code: full_code
            }
            userService.verify(data)
                .then(
                function (data) {
                    localStorage.setItem('user', JSON.stringify(data.user))
                    this.$router.go()
                }.bind(this)
                )
                .catch(
                function (ex) {
                    this.errors.wrong_code = true;
                    for(var i=1; i<=6; i++){
                        $('#code'+i).val('')
                    }
                    $('#code1').focus()
                    this.loading = false
                    // this.loginError = true;
                }.bind(this)
                )
                .finally(
                function () {
                }.bind(this)
                );
        },
        nextNumber(index){
            let current_input = $('#code'+index).val()
            if(index < 6 && current_input.length==1 && !isNaN(current_input) && current_input >=0 && current_input<=9 ){
                $('#code'+(index+1)).focus()
            }else if(index != 6){
                $('#code'+index).val('')
                $('#code'+index).focus()
            }else{
                this.verify()
            }
        },
        register(){
            this.loading = true
            this.errors.register = false;
            let data = {
                phone: this.registerForm.phone.toString().replace(/ /g, ""),
                phone_prefix: this.Config.options.phone_default_prefix,
                fullname: this.registerForm.name,
                email: this.registerForm.email,
                social_reason: this.registerForm.social_reason,
                country: 'tn',
            };

            userService.register(data)
                .then(
                function () {
                    this.phone = data.phone;
                    $('.RegisterModal').fadeOut("300", function(){
                        $('.LoginModal').fadeIn("300")
                        this.optForVerification = true
                    }.bind(this))
                }.bind(this)
                )
                .finally(
                function () {
                    this.loading= false;
                }.bind(this)
                )
                .catch(
                function () {
                    this.errors.register = true;
                }.bind(this)
                );
        },
        login(){
            let data = {
                phone: this.phone.toString().replace(/ /g, ""),
                phone_prefix: this.Config.options.phone_default_prefix,
            };
            if(data.phone.length <= this.Config.options.phone_max_length && data.phone.length > 5){
                this.loading = true
                userService.login(data.phone, data.phone_prefix)
                    .then(
                    function (data) {
                        this.optForVerification = true
                        $('#code1').focus()
                        setTimeout(function(){
                            $('#code1').focus()
                        }, 300)
                    }.bind(this)
                    )
                    .catch(
                    function (ex) {
                        this.registerForm.phone = this.phone;
                        $('.LoginModal').fadeOut("300", function(){
                            $('.RegisterModal').fadeIn("300")
                        })
                    }.bind(this)
                    )
                    .finally(
                    function () {
                        this.loading = false
                    }.bind(this)
                    );
            }else{
                this.errors.length_error = true
            }
        },
        show(){
            $('#LandingLogin').fadeIn("300")
        },
        hide(){
            $('#LandingLogin').fadeOut("300", function(){
                $('.LoginModal').fadeIn()
                $('.RegisterModal').fadeOut()
                $('.VerifyModal').fadeOut()
            })
        }
    }
})
</script>

<style lang="scss" scoped>
    #LandingLogin{
        width: 100vw;
        height: 100vh; min-height: -webkit-fill-available;
        overflow-x: hidden !important;
        overflow-y: hidden !important;
        position: absolute;
        top: 50%;
        margin: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999999990;

        display: none;
        .overlay{
            width: 100vw;
            height: 100vh; min-height: -webkit-fill-available;
            z-index: 9999999999991;
            cursor: pointer;
            background: rgba($color: #000000, $alpha: 0.3);
        }
        .modal{
            width: 40%;
            height: auto;
            min-width: 320px;
            background: #fff;
            z-index: 992;
            border-radius: 25px;
            padding: 50px;
            
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .Verify{
                margin-top: 20px;
                .code{
                    display: flex;
                    justify-content: center;
                    input{
                        margin-left: 10px;
                        margin-right: 10px;
                        height: 50px;
                        width: 50px;
                        border: 1px solid var(--primary);
                        color: var(--primary);
                        border-radius: 5px;
                        text-align: center;
                        font-size: 15px;
                    }
                }
            }
            .group{
                b{
                    color: var(--primary);
                    font-size: 16px;
                    font-size: 900;
                    margin-bottom: 10px;
                    display: block;
                }
                input{
                    width: 100%;
                    height: 40px;
                    padding: 0 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 14px;
                    letter-spacing: 1px;
                }
            }
            .footer{
                text-align: center;
                margin-top: 20px;
                .text{
                    color: #555;
                    font-size: 14px;
                }
                button{
                    background: var(--primary);
                    color: var(--primary-font);
                    padding: 15px 50px;
                    border-radius: 100px;
                    letter-spacing: 1px;
                    margin-top: 20px;
                    font-size: 15px;
                }
                button:hover{
                    background: var(--primary-hover);
                }
            }
        }
        .RegisterModal{
            display: none;
        }
        @media only screen and (max-width: 800px) {
            .modal{
                .Verify{
                    .code{
                        input{
                            width: 40px;
                            height: 40px;
                            margin-left: 5px;
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
    }
    
</style>