<template>
    <div class="home page-view">
        <v-container>
            <h1 class="text-center">Crypto Portfolio App</h1>

            <br />
            <v-divider></v-divider>
            <br />

            <v-alert v-if="pageAlert.message" transition="scale-transition" :value="true" :type="pageAlert.type" class="page-alert">
                <strong>{{ pageAlert.message }}</strong>
            </v-alert>

            <section v-if="pageLoading" class="page-loading">
                <v-progress-circular indeterminate color="custom-theme-color"></v-progress-circular> Loading...
            </section>



            <section v-else-if="profitsEndpointSaved" class="text-center">
                <section v-if="profits">
                    <v-layout row wrap class="profits-items">
                        <v-flex xs12>
                            <h2 class="text-center">
                                <strong>Your Portfolio Summary</strong>
                            </h2>
                        </v-flex>

                        <v-flex xs12 sm4>
                            <v-card class="profits-item">
                                <v-card-text class="px-0">
                                    <span v-if="profits.profit > 0">Made</span><span v-else>Lost</span>

                                    <strong>&euro; {{ profits.profit }}</strong>
                                </v-card-text>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm4>
                            <v-card class="profits-item">
                                <v-card-text class="px-0">
                                    <span>Invested</span>

                                    <strong>&euro; {{ profits.invested }}</strong>
                                </v-card-text>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm4>
                            <v-card class="profits-item">
                                <v-card-text class="px-0">
                                    <span>Take Home</span>

                                    <strong>&euro; {{ profits.worth }}</strong>
                                </v-card-text>
                            </v-card>
                        </v-flex>

                        <v-flex xs12>
                            <p class="text-center">
                                <strong>Last Updated on {{ profits.last_sync }}</strong>
                            </p>
                        </v-flex>
                    </v-layout>
                </section>

                <section v-else>
                    <h3>Are you sure you have added the right profits endpoint?</h3>

                    <p>No profits could be retrieved.</p>

                    <br />

                    <v-btn large rounded color="primary" @click="getProfits()">
                        <v-icon left>cloud</v-icon> Try Again?
                    </v-btn>
                </section>
            </section>



            <section v-else class="text-center">
                <v-form @submit.prevent="saveProfitsEndpoint" id="profits-endpoint-form" v-model="profitsEndpointForm.valid">
                    <v-card-text>
                        <h2>You have not entered your profits endpoint. Enter it below!</h2>

                        <br />
                        <v-divider></v-divider>
                        <br />

                        <v-text-field :disabled="profitsEndpointForm.formLoading" prepend-icon="cloud" :rules="profitsEndpointForm.defaultRules" v-model="profitsEndpointForm.profitsEndpoint" name="profits-endpoint" label="Enter Your Endpoint" type="text" required></v-text-field>
                    </v-card-text>

                    <v-card-actions class="justify-center">
                        <v-btn :loading="profitsEndpointForm.formLoading" large rounded color="primary" type="submit" form="profits-endpoint-form" :disabled="! profitsEndpointForm.valid || profitsEndpointForm.formLoading">
                            Save <v-icon right small>check</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </section>



            <section v-if="profitsEndpointSaved && ! pageLoading" class="text-center profits-endpoint-display-area">
                <h2>Your profits endpoint:</h2>
                <p class="profits-endpoint-display">{{profitsEndpointSaved}}</p>

                <v-btn small rounded color="warning" @click="resetProfitsEndpoint()">
                    <v-icon left small>close</v-icon> Reset
                </v-btn>
            </section>
        </v-container>
    </div>
</template>

<script lang="js">
    export default {
        data(){
            return {
                pageLoading: true,

                pageAlert: {
                    type: null,
                    message: false,
                },

                profitsEndpointForm: {
                    formLoading: false,
                    profitsEndpoint: '',
                    valid: false,
                    defaultRules: [
                        v => !!v || 'This field is required.',
                    ]
                }
            }
        },
        computed: {
            profitsEndpointSaved () {
                return this.$store.state.profits_endpoint_saved
            },
            profits () {
                return this.$store.state.profits
            }
        },
        created () {
            this.loadProfits()
        },
        methods: {
            loadProfits() {
                setTimeout( () => {
                    this.getProfits();
                }, 1000);
            },

            saveProfitsEndpoint() {
                const profitsEndpoint = this.profitsEndpointForm.profitsEndpoint;

                if ( profitsEndpoint && this.profitsEndpointForm.valid ) {
                    this.showPageLoading();
                    this.hidePageAlert();

                    this.$store.dispatch( 'saveProfitsEndpoint', profitsEndpoint ).then( response => {
                        this.hidePageLoading();
                        this.showPageAlert('success', response);

                        this.getProfits();
                    }, error => {
                        this.hidePageLoading();
                        this.showPageAlert('error', error);
                    });
                }
            },

            resetProfitsEndpoint() {
                if ( confirm('Are you sure you want to reset your profits endpoint?') ) {
                    this.showPageLoading();
                    this.hidePageAlert();

                    this.$store.dispatch( 'resetProfitsEndpoint' ).then( response => {
                        this.hidePageLoading();

                        this.showPageAlert('success', response);

                        setTimeout( () => {
                            this.hidePageAlert();
                        }, 3000);
                    }, error => {
                        this.hidePageLoading();
                        this.showPageAlert('error', error);

                        setTimeout( () => {
                            this.hidePageAlert();
                        }, 3000);
                    });
                }
            },

            getProfits() {
                if ( this.profitsEndpointSaved ) {
                    this.showPageLoading();
                    this.hidePageAlert();

                    this.$store.dispatch('getProfits').then( response => {
                        this.hidePageLoading();
                    }, error => {
                        this.hidePageLoading();
                        this.showPageAlert('error', error);
                    });
                } else {
                    this.hidePageLoading();
                }
            },

            showPageLoading() {
                this.pageLoading = true;
            },

            hidePageLoading() {
                this.pageLoading = false;
            },

            showPageAlert(type, message) {
                this.pageAlert.type = type;
                this.pageAlert.message = message;
            },

            hidePageAlert() {
                this.pageAlert.type = null;
                this.pageAlert.message = null;
            }
        }
    }
</script>