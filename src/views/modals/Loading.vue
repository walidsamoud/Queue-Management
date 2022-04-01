<template>
    <div class="loading-wrapper" v-if="active">
        <div class="loading-popup">
            <div class="row h-100 align-items-center" style="margin-top: 20px;margin-left: 2px;">
                <div class="col-3 text-center">
                    <img class="loader" :src="'/loader-circle.gif'" />
                </div>
                <div class="col-9">{{message}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoadingPopup',
        props: {
            message: String,
            active: Boolean,
        }
    }
</script>

<style scoped>
    .loading-wrapper{
        background: rgba(0, 0, 0, 0.70);
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }

    .loading-popup{
        width: 60%;
        max-width: 500px;
        height: 100px;
        background: #ffffff;
        border-radius: 20px;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        color: #264076;
    }

    .loader{
        width: 50px;
        height: 50px;
    }
</style>