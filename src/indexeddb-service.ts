import { resolve } from "dns";
import { YelpBusiness, YelpBusinessSearchOptions } from "models";

interface EventWithResult<T> extends Event {
    target: {
        result: T;
    } & EventTarget
}

const openDatabaseRequest = indexedDB.open("nightlife-coordination-app");
let database = new Promise<IDBDatabase>((resolve, reject) => {
    openDatabaseRequest.addEventListener("success", (event) => resolve((<any>event.target).result))
    openDatabaseRequest.addEventListener("error", reject);
})

const migrate = (database: IDBDatabase) => {
    const storeNames = database.objectStoreNames

    if(storeNames.contains("businesses")) {
        return;    
    }
    
    const businesses = database.createObjectStore("businesses", { keyPath: "id" });
    const cities = database.createObjectStore("cities", { keyPath: "id" });
}

const upgradeneeded = (event: EventWithResult<IDBDatabase>) => {
    migrate(event.target.result);
}
openDatabaseRequest.addEventListener("upgradeneeded", upgradeneeded)

export const getBusinessFromDb = async (id: string) => {
    const transaction = (await database).transaction("businesses", "readonly")
    const businesses = transaction.objectStore("businesses");

    const request = businesses.get(id);
    
    return await new Promise<YelpBusiness>((resolve, reject) => {
        request.addEventListener("success", (event: EventWithResult<YelpBusiness>) => resolve(event.target.result));
    })
}

export const getBusinessesFromDb = async (options: YelpBusinessSearchOptions) => {
    const transaction = (await database).transaction("businesses", "readonly")
    const businesses = transaction.objectStore("businesses");

    const request = businesses.openCursor();
    const array: YelpBusiness[] = [];

    const { location, term } = options;

    return await new Promise<YelpBusiness[]>((resolve, reject) => {
        request.addEventListener("success", (event: EventWithResult<IDBCursorWithValue>) => {
            const cursor = event.target.result;
            
            if(cursor) {
                const business = cursor.value as YelpBusiness;
                
                if(term) {
                    
                    let normalizedTerm = term.toLowerCase();
                    let normalizedBusinessName = business.name.toLowerCase();

                    if(normalizedBusinessName.includes(term)) {
                        array.push(business);
                    }
                    
                    const normalizedCity = business.location.city.toLowerCase();

                    if(normalizedCity.includes(normalizedTerm)) {
                        array.push(business);
                    }
                    
                    cursor.continue();
                    return;
                }

                if(location) {
                    if(location.includes(business.location.city.toLowerCase())) {
                        array.push(business);
                    }
                }
                else {
                    array.push(business);
                }
                
                cursor.continue();
                return;
            }
    
            resolve(array);
        })
    })
}

export const addBusinesses = async (data: YelpBusiness[]) => {
    const transaction = (await database).transaction("businesses", "readwrite")
    const businesses = transaction.objectStore("businesses")

    for(let record of data) {
        const request = businesses.get(record.id);

        const business = await new Promise<YelpBusiness>((resolve, reject) => {
            request.addEventListener("success", (event: EventWithResult<YelpBusiness>) => {
                resolve(event.target.result);
            })
            request.addEventListener("error", (event) => {console.log(event);resolve(null)});
        })
        
        if(!business) {
            businesses.add(record);
        }
    }
}
