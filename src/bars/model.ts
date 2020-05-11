import ko from "knockout";
import { assignToBar, getCurrentPosition, getBusinesses } from "../api";
import { goToPageWithFadeOutIn } from "../utils";
import "./style.styl";
import { YelpBusiness } from "models";
import moment from "moment";
import { debounce } from "lodash";

export default {
    id: "bars",
    defaultImage: require("../assets/defaultImage.jpg").default,
    bars: ko.observableArray([]),
    search: ko.observable(""),
    loading: ko.observable(true),
    addToBar(business: YelpBusiness) {
        if(!this.loggedIn()) {
            goToPageWithFadeOutIn("login");
            return;
        }

        this.assignedBarId(business.id);
        this.assignedToBar(true);
        assignToBar(business.id, business.name, moment().toDate())
            .then(_ => {
                goToPageWithFadeOutIn("bar");
            })
    },
    showOnMap(business: YelpBusiness) {
        $(".location-view-modal").fadeIn("slow", () => {
            
        })
    },
    onLoad() {
        this.search.subscribe(debounce((value: any) => {

            this.loading(true);
            getBusinesses({
                location: value
            }).then(data => {
                this.bars(data);
                this.loading(false);
            })
        }, 500))

        getCurrentPosition()
            .then(position => {
                const { coords } = position
                getBusinesses(coords).then(data => {
                    this.bars(data);
                    this.loading(false);
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
}