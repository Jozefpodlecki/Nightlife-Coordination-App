declare module "pagerjs" {
    export interface PagerCallback {
        add(): void,
        remove(): void,
        has(): void,
        empty(): void,
        disable(): void
        disabled(): void;
        empty(): void;
        fire(): void;
        fireWith(context: any, args: any): void;
        fired(): void;
        has(fn: any): void;
        lock(): void;
        locked(): void;
        remove(): void;
    }

    export class Pager {
        start(): void;
        extendWithPage(viewModel: any): void;
        ChildManager(children: any, page: any): void;
        Href(element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any): void;
        Href5(element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any): void;
        Page(element: any, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: any): void;
        afterHide: PagerCallback;
        afterRemove: PagerCallback;
        afterShow: PagerCallback;
        beforeHide: PagerCallback;
        beforeRemove: PagerCallback;
        beforeShow: PagerCallback;
        dataAttribute(): void;
        extendWithPage(viewModel: any): void;
        fx: {
            zoom: void;
            flip: void;
            popout: void;
            cssAsync(): void;
            jQuerySync(): void;
        }
        getActivePage(): void;
        getParentPage(bindingContext: any): void;
        goTo(path: any): void;
        ignoreRouteCase: boolean;
        navigate(path: any): void;
        now(): Date;
        onBindingError: PagerCallback;
        onMatch: PagerCallback;
        onNoMatch: PagerCallback;
        onSourceError: PagerCallback;
        page: any;
        rootURI: string;
        showChild(route: any): void;
        start(options: any): void;
        startHistoryJs(options?: any): void;
        useHTML5history: boolean;
    }
    
    export const pager: Pager;
}

declare module "yelp-fusion" {
    
    export interface YelpSearchParams {
        term?: string;
        location?: string;
    }

    export class YelpClient {
        
        constructor(apiKey: string, options: any);

        send(requestOptions: any): Promise<any>;
        search(parameters: YelpSearchParams): Promise<any>;
        phoneSearch(parameters: any): Promise<any>;
        transactionSearch(transactionType: any, parameters: any): Promise<any>;
        business(id: any): Promise<any>;
        reviews(businessId: any): Promise<any>;
        autocomplete(parameters: any): Promise<any>;
        businessMatch(parameters: any): Promise<any>;
        eventLookup(eventId: any, parameters: any): Promise<any>;
        eventSearch(parameters: any): Promise<any>;
        featuredEvent(parameters: any): Promise<any>;
        allCategories(): Promise<any>;
        categoryDetails(alias: any): Promise<any>;
    }
    
    export const client: (apiKey: string, options?: any) => YelpClient;
}