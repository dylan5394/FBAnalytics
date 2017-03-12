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

        //Decide how many months back to go
        this.periodicalData = [];

        this.topThreeTotal = [];
        this.topThreeAverage = [];
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

    get facebookPosts() {

        return this.totalPosts;
    }

    calculateTopThreeTotal() {

        //TODO: Verify that this is working
        for(var element in this.friendsLikes) {

            if(this.topThreeTotal.length < 3) {

                this.topThreeTotal.push(this.friendsLikes[element]);
            } else if(this.topThreeTotal[2].likes < this.friendsLikes[element].likes) {

                this.topThreeTotal[2] = this.friendsLikes[element];
            }

            this.topThreeTotal.sort(function(a, b) {
                    return a.likes - b.likes;
            });
        }

        console.log(this.topThreeTotal);
    }

    calculateTopThreeAverage() {

        //TODO: Verify that this is working
        for(var element in this.friendsLikes) {

            if(this.topThreeAverage.length < 3) {

                this.topThreeAverage.push(this.friendsLikes[element]);
            } else if(this.topThreeAverage[2].likes/this.topThreeAverage[2].posts < this.friendsLikes[element].likes/this.friendsLikes[element].posts) {

                this.topThreeAverage[2] = this.friendsLikes[element];
            }

            this.topThreeAverage.sort(function(a, b) {
                    return a.likes/a.posts - b.likes/b.posts;
            });
        }

        console.log(this.topThreeAverage);
    }

    get topFriendsTotal() {

        return this.topThreeTotal;
    }

    get topFriendsAverage() {

        return this.topThreeAverage;
    }

    get periodicalLineData() {

        return this.periodicalData;
    }

    calculateTagLikes(currentPost, likesObj) {

        var tags = currentPost.with_tags;
        if(tags) {

            for(var j = 0; j < tags.data.length; j ++) {

                if(this.friendsLikes[tags.data[j].name]) {

                    this.friendsLikes[tags.data[j].name].posts++;
                    this.friendsLikes[tags.data[j].name].likes+=likesObj.summary.total_count;
                } else {
                    this.friendsLikes[tags.data[j].name] = {
                        name: tags.data[j].name,
                        posts: 1,
                        likes: likesObj.summary.total_count
                    }
                }
                
            }
        }
    }

    addToTimePlotSeries(timeOfDay, likesObj) {

        var t = Date.parse("1-1-1 " + timeOfDay); 
        
        //Need to subtract more here depending on the users time zone
        //Make time zone static for now (central or pacific time)
        var timeToSubtract = Date.parse("1-1-1 " +
                                         "0" + (new Date()).getTimezoneOffset()/60
                                          +":00:00");
        var absTime = t-timeToSubtract;

        if(likesObj) { 
            this.timePlotSeriesData.push([absTime,likesObj.summary.total_count]);
            this.totalPostLikes+=likesObj.summary.total_count;
        }
        else this.timePlotSeriesData.push([absTime, 0]);
    }

    extractPeriodicalData(date, likesObj) {
        console.log(date);
        this.periodicalData.push({
            date:date,
            likes:likesObj.summary.total_count
        });
    }

    get monthlyData() {
        var currentDate = new Date();
        var months = new Array(12);
        for(var i = 0; i < periodicalData.length; i ++) {
            var year = periodicalData[i].date.split("-")[0];
            var month = periodicalData[i].date.split("-")[1];
            var index = currentDate.getMonth() - month + (year - currentDate.getFullYear()) * 12;

            if(index <= 11)
                months[index] += periodicalData.likes;
        }
    }

    setFacebookPostsData(type, data) {
        this.facebookPostsStatus = type;
        if (data) {
            this.facebookPostsData = data 

            for(var i  = 0; i < data.feed.data.length; i ++) {

                var currentPost = data.feed.data[i];

                var likesObj = currentPost.likes;
                var timeObj = currentPost.created_time.split("T");

                var timeOfDay = timeObj[1].substring(0, 8);
                var date = timeObj[0]; 

                //Extract likes per month, year, week, day from current post
                this.extractPeriodicalData(date, likesObj);
                //Add current post to time plot series data
                this.addToTimePlotSeries(timeOfDay, likesObj);
                //Find friends tagged in current post and increment their posts count and likes count
                this.calculateTagLikes(currentPost, likesObj);
                      
            }

            this.calculateTopThreeAverage();
            this.calculateTopThreeTotal();

            this.totalPosts = data.feed.data.length;

            console.log("Periodical data:" + this.periodicalData);
            console.log(this.friendsLikes);
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
            this.facebookPhotosData = data;
            
        } else {
            this.facebookPhotosData = {};
            
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