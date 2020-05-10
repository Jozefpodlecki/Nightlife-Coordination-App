import ko from "knockout";
import "./style.styl";
import { getLastBar } from "../api";

export default {
    id: "bar",
    bar: ko.observable({
        id: -1,
        name: '',
        image_url: '',
        price: '',
        rating: 0,
        categories: [],
        coordinates: {
            latitude: -1,
            longitude: -1
        },
        transactions: [],
        location: {
            city: '',
            country: '',
            display_address: []
        }
    }),
    onLoad() {
        this.loading(true);

        getLastBar()
            .then(data => {
                console.log(data);
                if(data) {
                    this.bar(data);
                }
                this.loading(false);
            })
    }
}