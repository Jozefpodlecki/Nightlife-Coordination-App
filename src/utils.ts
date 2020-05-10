export const goToPageWithFadeOutIn = (path: string) => {
    $(".content").fadeOut("slow", () => {
        window.pager.goTo(path);
        $(".content").fadeIn();
    })
}