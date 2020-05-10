import { YelpCategory } from "./YelpCategory";
import { YelpCoordinate } from "./YelpCoordinate";
import { YelpLocation } from "./YelpLocation";

export interface YelpBusiness {
    id: string;
    alias: string;
    categories: YelpCategory[];
    coordinates: YelpCoordinate[];
    display_phone: string;
    distance: number;
    image_url: string;
    is_closed: boolean;
    location: YelpLocation;
    name: string;
    phone: string;
    rating: number;
    review_count: number;
    transactions: any[]
    url: string;
}