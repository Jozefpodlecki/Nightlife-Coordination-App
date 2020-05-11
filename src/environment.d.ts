import ko from "knockout";

declare global {
    interface Window {
        $: JQueryStatic;
        ko: typeof ko;
        pager: any;
        initMap: () => void;
        google: any;
        googleMapsLoaded: Promise<unknown>
    }

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            APIKey: string;
            AppName: string;
        }
    }
}

export {}