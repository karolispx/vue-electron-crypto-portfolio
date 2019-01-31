import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import axios from 'axios'

let profitsEndpointSaved = localStorage.getItem('profits_endpoint_saved');

let initialState = {
    profits: null,
    profits_endpoint_saved: null
};

if ( profitsEndpointSaved ) {
    initialState['profits_endpoint_saved'] = profitsEndpointSaved;
}

export default new Vuex.Store({
    state: initialState,
    mutations: {
        resetProfitsEndpointSuccess(state) {
            state.profits_endpoint_saved = null;
            profitsEndpointSaved = null;
        },

        saveProfitsEndpointSuccess(state, profitsEndpoint) {
            state.profits_endpoint_saved = profitsEndpoint;
            profitsEndpointSaved = profitsEndpoint;
        },

        getProfitsRequest(state) {
            state.profits = null;
        },
        getProfitsSuccess(state, response) {
            if ( response.syncdata ) {
                state.profits = response.syncdata;
            }
        },
        getProfitsError(state) {
            state.profits = null;
        }
    },
    actions: {
        resetProfitsEndpoint( { commit } ) {
            return new Promise((resolve, reject) => {
                if ( profitsEndpointSaved ) {
                    localStorage.removeItem('profits_endpoint_saved');

                    commit('resetProfitsEndpointSuccess');

                    resolve("Profits endpoint has been reset successfully.");
                } else {
                    reject("Profits endpoint has not been added yet.");
                }
            });
        },

        saveProfitsEndpoint( { commit }, profitsEndpoint ) {
            return new Promise((resolve, reject) => {
                if ( ! profitsEndpointSaved ) {
                    if ( profitsEndpoint ) {
                        localStorage.setItem('profits_endpoint_saved', profitsEndpoint);

                        commit('saveProfitsEndpointSuccess', profitsEndpoint);

                        resolve("Profits endpoint has been added successfully.");
                    } else {
                        reject("Please provide a profits endpoint.");
                    }
                } else {
                    reject("Profits endpoint has been added already.");
                }
            });
        },

        getProfits( { commit } ) {
            return new Promise((resolve, reject) => {
                if ( profitsEndpointSaved ) {
                    commit('getProfitsRequest');

                    axios({
                        url: profitsEndpointSaved,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }).then(response => {
                        commit('getProfitsSuccess', response.data.response);

                        resolve(true);
                    }).catch(error => {
                        let errorMessage = 'Something went wrong while retrieving your profits. Please try again later.';

                        if ( error.response && error.response.data.response ) {
                            errorMessage = error.response.data.response;
                        }

                        commit('getProfitsError');

                        reject(errorMessage);
                    });
                } else {
                    reject("Profits endpoint has not been added yet.");
                }
            });
        }
    }
})
