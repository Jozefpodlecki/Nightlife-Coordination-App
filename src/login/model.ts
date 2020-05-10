import ko from "knockout";
import { signIn } from "../api";
import { goToPageWithFadeOutIn } from "../utils";
import "./style.styl";

export default {
    id: "login",
    username: ko.observable(""),
    password: ko.observable(""),
    signIn() {
        signIn({
            username: this.username(),
            password: this.password()
        }).then(pr => {
            this.loggedIn(true);
            goToPageWithFadeOutIn("bars");
        })
    }
}