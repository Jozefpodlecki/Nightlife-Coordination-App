export interface YelpBusinessSearchOptions {
    term?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    categories?: string[]
    locale?: string;
    limit?: number;
    offset?: number;
    sort_by?: string;
    price?: string;
    open_now?: boolean;
    open_at?: number;
    attributes?: string;
}