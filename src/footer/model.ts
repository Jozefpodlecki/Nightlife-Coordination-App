import ko from "knockout";
import "./style.styl";
import moment from "moment";

export default {
    author: ko.observable(`© Jozef Podlecki ${moment().year()}`),
    socials: ko.observableArray([
        {
            href: "https://jozefpodlecki.github.io/",
            icon: "fas fa-globe"
        },
        {
            href: "https://www.linkedin.com/in/jozef-witold-podlecki/",
            icon: "fab fa-linkedin"
        },
        {
            href: "https://github.com/Jozefpodlecki",
            icon: "fab fa-github"
        }
    ])
}