import { client as createClient } from 'yelp-fusion'
import { YelpBusiness, YelpBusinessSearchOptions, Credentials, Activity } from './models';
import { addBusinesses, getBusinessesFromDb, getBusinessFromDb } from './indexeddb-service';
import moment, { Moment } from 'moment';

const corsProxyUrl = "https://cors-anywhere.herokuapp.com"

const getActivitiesFromLocalStorage = () => <Activity[]>JSON.parse(localStorage.getItem("activities")) || [];

const setActivitiesToLocalStorage = (activities: Activity[]) => localStorage.setItem("activities", JSON.stringify(activities))

export const getActivities = () => new Promise<Activity[]>((resolve, reject) => {

    let activities = getActivitiesFromLocalStorage();

    if(!activities) {
        activities = [
            {
                id: 1,
                userId: "1",
                date: moment().subtract(1, 'days').toDate(),
                barId: "6ATsp0y68jBVT_e9mJUyYg",
                bar: "Magnolia Table"
            },
            {
                id: 2,
                userId: "1",
                date: moment().subtract(2, 'days').toDate(),
                barId: "GKutMmSArRsrnJJUusOpBw",
                bar: "Moroso Wood Fired Pizzeria"
            },
            {
                id: 3,
                userId: "1",
                date: moment().subtract(3, 'days').toDate(),
                barId: "w0tlirud6E90u5RIjRx6cQ",
                bar: "Slovacek's West"
            }
        ]
    }

    resolve(activities);
})

const sameDayPredicate = (currentDate: moment.Moment = null) => {
    if(!currentDate) {
        currentDate = moment();
    } 

    return (date: Date) => currentDate.isSame(moment(date), 'days')
}

export const getLastBar = async () => {
    let activities = getActivitiesFromLocalStorage();
    let isSameDay = sameDayPredicate();
    let activity = activities.find(pr => isSameDay(pr.date));

    if(!activity) {
        return null;
    }

    const business = await getBusinessFromDb(activity.barId)
    
    return business;
}

export const isAssignedToBar = () => new Promise<Activity>((resolve, reject) => {
    let activities = getActivitiesFromLocalStorage();

    let isSameDay = sameDayPredicate();
    let activity = activities.find(pr => isSameDay(pr.date))
    
    resolve(activity);
})

export const assignToBar = (id: string, name: string, date: Date) => new Promise((resolve, reject) => {
    
    let activities = getActivitiesFromLocalStorage();

    let isSameDay = sameDayPredicate();
    let activity = activities.find(pr => isSameDay(pr.date))

    const newActivity = {
        id: activities.reduce((acc, activity) => acc > activity.id ? activity.id : acc , 0) + 1,
        userId: "1",
        bar: name,
        barId: id,
        date
    }

    if(activity) {
        activities = [
            ...activities.filter(pr => pr.id !== activity.id),
            newActivity
        ]
        setActivitiesToLocalStorage(activities);
        return resolve();
    }
    
    activities = [
        ...activities,
        newActivity
    ]
    setActivitiesToLocalStorage(activities);
    return resolve();
})

export const signOut = () => new Promise((resolve, reject) => {
    localStorage.removeItem("state");
    resolve();
})

export const signIn = (credentials: Credentials) => new Promise((resolve, reject) => {
    localStorage.setItem("state", "loggedIn");
    resolve();
})

export const isSignedIn = () => new Promise<boolean>((resolve, reject) => {
    if(localStorage.getItem("state")) {
        return resolve(true);
    }

    return resolve(false);
})

export const getCurrentPosition = () => new Promise<Position>((resolve, reject) => {
    
    if(!("geolocation" in navigator)) {
        reject("error");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
    }, (error) => {
        reject(error);
    });
})


export const getCities = (namePrefix: string) => {
    const baseUrl = "http://geodb-free-service.wirefreethought.com/v1/geo/cities";
    const url = `${corsProxyUrl}/${baseUrl}?namePrefix=${namePrefix}&limit=5&offset=0`
    
    return fetch(`${corsProxyUrl}/${url}`, {
        headers: new Headers({
            
        })
    }).then(pr => pr.json())
}

export const getBusinesses: (options: YelpBusinessSearchOptions) => Promise<YelpBusiness[]> = async (options: YelpBusinessSearchOptions) => {
    const yelpBusinessUrl = "https://api.yelp.com/v3/businesses"
    const { APIKey } = process.env;
    
    const storedBusinessnes = await getBusinessesFromDb(options);

    if(storedBusinessnes.length) {
        return storedBusinessnes;
    }

    let query = '/search'
    let connector = '?'

    if(options.location) {
        query = `${query}${connector}location=${options.location}`
        connector = '&'
    }

    if(options.term) {
        query = `${query}${connector}term=${options.term}`
    }

    const result = await fetch(`${corsProxyUrl}/${yelpBusinessUrl}${query}`, {
        headers: new Headers({
            "Authorization": `Bearer ${process.env.APIKey}`
        })
    }).then(pr => pr.json())

    await addBusinesses(result.businesses);
    return result.businesses;
}