import * as ko from 'knockout';
import { default as $ } from 'jquery';
import { debounce } from 'lodash'
import { BindingHandler } from 'knockout';
import "./loader/style.styl";
import "./styles.styl";
import "./navbar/style.styl";
import "./location-view-modal/style.styl";
import loginModel from "./login/model"
import barsModel from "./bars/model"
import barModel from "./bar/model"
import historyModel from "./history/model"
import footerModel from "./footer/model"

import { Pager } from 'pagerjs';
import { getBusinesses, getCurrentPosition, isSignedIn, signIn, signOut, getActivities, assignToBar, isAssignedToBar } from './api';

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands' 
import { YelpBusiness } from 'models';
import moment from 'moment';
import { goToPageWithFadeOutIn } from './utils';

let pager: Pager = null;

const initializePager = () => {
    window.$ = $;
    window.ko = ko;
    return require('pagerjs') && window.pager as Pager;
}

window.initMap = function() {
    const mapContainer = document.getElementById('map');
    const data = {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    }

    //var map = new window.google.maps.Map(mapContainer, data);
  }

$(document).ready(() => {

    const viewModel = {
        appName: process.env.AppName,
        loggedIn: ko.observable(false),
        assignedToBar: ko.observable(false),
        assignedBarId: ko.observable(null),
        ...barModel,
        ...historyModel,
        ...loginModel,
        ...barsModel,
        ...footerModel,
        afterShow() {
            const id = this["$__page__"].route[0];

            const callbacks = {
                [barModel.id]: barModel.onLoad,
                [barsModel.id]: barsModel.onLoad,
                [historyModel.id]: historyModel.onLoad,
            }

            const callback = callbacks[id];

            if(callback) {
                callback.bind(this)();
            }
        },
        goToHome() {
            goToPageWithFadeOutIn("bars")
        },
        goToAssignedBar() {
            goToPageWithFadeOutIn("bar");
        },
        goToHistory() {
            goToPageWithFadeOutIn("history");

            getActivities()
                .then(data => {
                    const computed = data.map(pr => ({
                        ...pr,
                        date: moment(pr.date).format("MM-DD-YYYY"
                    )}))

                    this.activities(computed);
                })
        },
        goToSignIn() {
            goToPageWithFadeOutIn("login");
        },
        signOut() {
            signOut()
            this.loggedIn(false);
            goToPageWithFadeOutIn("bars");
        }
    };

    pager = initializePager();

    //pager.useHTML5history = true;
    pager.extendWithPage(viewModel);

    ko.applyBindings(viewModel);

    pager.goTo("bars")

    viewModel.loggedIn.subscribe(value => {
        if(value) {
            isAssignedToBar()
                .then(activity => {
                    if(activity) {
                        viewModel.assignedBarId(activity.barId);
                        viewModel.assignedToBar(true);
                    }
                })
        }
    })

    isSignedIn()
        .then(value => {
            if(value) {
                viewModel.loggedIn(true)
            }
        })
})