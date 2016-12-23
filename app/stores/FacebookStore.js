import Constants from '../constants/Constants';
import FacebookDispatcher from '../dispatcher/FacebookDispatcher';
import {EventEmitter} from 'events';

const FACEBOOK_CHANGE_EVENT = 'FACEBOOK_CHANGE_EVENT';

class FacebookStore extends EventEmitter {
    constructor() {
        super()
        this.facebookAuthData = {};
        this.facebookPictureData = {};
        this.facebookPostsData = {};
        this.facebookPhotosData = {};
        this.facebookFriendsData = {};

        this.timePlotSeriesData = [];
        this.totalPostLikes = 0;
        this.totalPosts = 0;
        this.totalFriends = 0;

        //Create map of friends -> # of likes
        this.friendsLikes = new Map();
    }

    setFacebookAuthData(data) {
        this.facebookAuthData = data;
        this.emitChange();
    }

    get loggedIn() {
        if (!this.facebookAuthData) {
            return;
        }

        return this.facebookAuthData.status == 'connected';
    }

    get userId() {
        if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
            return;
        }

        return this.facebookAuthData.authResponse.userID;
    }

    get accessToken() {
        if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
            return;
        }

        return this.facebookAuthData.authResponse.accessToken;
    }

    get facebookPictureUrl() {
        if (!this.facebookPictureData || !this.facebookPictureData.url) {
            return;
        }

        return this.facebookPictureData.url;
    }

    setFacebookPictureData(type, data) {
        this.facebookPictureStatus = type;

        if (data) {
            this.facebookPictureData = data.data 
        } else {
            this.facebookPictureData = {};
        }

        this.emitChange();
    }
    
    get facebookPostLikes() {

        return this.totalPostLikes;
    }

    get timePlotSeries() {

        return this.timePlotSeriesData;
    }

    //TODO: for consistency, move the return calculation into the set method, then return a variable
    get facebookPosts() {

        return this.totalPosts;
    }

    setFacebookPostsData(type, data) {
        this.facebookPostsStatus = type;

        if (data) {
            this.facebookPostsData = data 

            var series = [];
            var totalLikes = 0;
            for(var i  = 0; i < data.feed.data.length; i ++) {

                var currentPost = data.feed.data[i];

                var likesObj = currentPost.likes;
                var timeObj = currentPost.created_time;
                
                var dateTime = timeObj.split("T")[1].substring(0, 8); 
                var t = Date.parse("1-1-1 " + dateTime); 
                
                //Need to subtract more here depending on the users time zone
                //Make time zone static for now (central or pacific time)
                var timeToSubtract = Date.parse("1-1-1 " +
                                                 "0" + (new Date()).getTimezoneOffset()/60
                                                  +":00:00");
                var absTime = t-timeToSubtract;

                if(likesObj) { 
                    series.push([absTime,likesObj.summary.total_count]);
                    totalLikes+=likesObj.summary.total_count;
                }
                else series.push([absTime, 0]);

                
                var tags = currentPost.with_tags;
                if(tags) {

                    for(var j = 0; j < tags.data.length; j ++) {

                        
                        if(this.friendsLikes[tags.data[j].name]) {

                            this.friendsLikes[tags.data[j].name].posts++;
                            this.friendsLikes[tags.data[j].name].likes+=likesObj.summary.total_count;
                        } else {
                            this.friendsLikes[tags.data[j].name] = {
                                posts: 1,
                                likes: likesObj.summary.total_count
                            }
                        }
                        
                    }
                }        
            }
            console.log("Printing friendsLikes:");
            console.log(this.friendsLikes);

            //console.log(series);
            this.timePlotSeriesData = series;
            this.totalPostLikes = totalLikes;
            this.totalPosts = data.feed.data.length;
        } else {
            this.facebookPostsData = {};

            this.timePlotSeriesData = [];
            this.totalPostLikes = 0;
            this.totalPosts = 0;
        }

        this.emitChange();
    }

    get facebookPhotos() {

        if (!this.facebookPhotosData) {
            return;
        }

        return this.facebookPhotosData;
    }

    setFacebookPhotosData(type, data) {

        this.facebookPhotosStatus = type;

        if (data) {
            this.facebookPhotosData = data
            this.totalFriends = data.friends.summary.total_count;
        } else {
            this.facebookPhotosData = {};
            this.totalFriends = 0;
        }

        this.emitChange();
    }

    get facebookFriends() {

        return this.totalFriends;
    }

    setFacebookFriendsData(type, data) {
        this.facebookFriendsStatus = type;

        if (data) {
            this.facebookFriendsData = data;
            this.totalFriends = data.friends.summary.total_count;
        } else {
            this.facebookFriendsData = {};
            this.totalFriends = 0;
        }

        this.emitChange();
    }

    emitChange() {
        this.emit(FACEBOOK_CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(FACEBOOK_CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(FACEBOOK_CHANGE_EVENT, callback);
    }
}

// initialize the store as a singleton
const facebookStore = new FacebookStore();

facebookStore.dispatchToken = FacebookDispatcher.register((action) => {
    if (action.actionType == Constants.FACEBOOK_INITIALIZED) {
        facebookStore.setFacebookAuthData(action.data);
    }

    if (action.actionType == Constants.FACEBOOK_LOGGED_IN) {
        facebookStore.setFacebookAuthData(action.data);
    }

    if (action.actionType == Constants.FACEBOOK_LOGGED_OUT) {
        facebookStore.setFacebookAuthData(action.data);
    }

    if (action.actionType == Constants.FACEBOOK_GETTING_PICTURE) {
        facebookStore.setFacebookPictureData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_RECEIVED_PICTURE) {
        facebookStore.setFacebookPictureData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_GETTING_POSTS) {
        facebookStore.setFacebookPostsData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_RECEIVED_POSTS) {
        facebookStore.setFacebookPostsData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_GETTING_PHOTOS) {
        facebookStore.setFacebookPhotosData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_RECEIVED_PHOTOS) {
        facebookStore.setFacebookPhotosData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_GETTING_FRIENDS) {
        facebookStore.setFacebookFriendsData(action.actionType, action.data);
    }

    if (action.actionType == Constants.FACEBOOK_RECEIVED_FRIENDS) {
        facebookStore.setFacebookFriendsData(action.actionType, action.data);
    }
})

module.exports = facebookStore;