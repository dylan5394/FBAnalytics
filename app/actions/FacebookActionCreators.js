
import FacebookDispatcher from '../dispatcher/FacebookDispatcher';
import Constants from '../constants/Constants'

const APP_ID = '223833464712562'

const FacebookActionCreators = {
    initFacebook: function() {
        window.fbAsyncInit = function() {
            FB.init({
              appId      : APP_ID,
              xfbml      : true,
              version    : 'v2.8'
            });

            // after initialization, get the login status
            FacebookActionCreators.getLoginStatus();
        },

        (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    },

    getLoginStatus: function() {
        window.FB.getLoginStatus((response) => {
            FacebookDispatcher.dispatch({
                actionType: Constants.FACEBOOK_INITIALIZED,
                data: response
            })
        });
    },

    login: () => {
        window.FB.login((response) => {
            if (response.status === 'connected') {
                FacebookDispatcher.dispatch({
                    actionType: Constants.FACEBOOK_LOGGED_IN,
                    data: response
                })
            }
        }, {scope: 'user_posts, user_photos, user_friends'});
    },

    logout: () => {
        window.FB.logout((response) => {
            FacebookDispatcher.dispatch({
                actionType: Constants.FACEBOOK_LOGGED_OUT,
                data: response
            })
        })
    },

    getFacebookProfilePicture: (userId) => {
        FacebookDispatcher.dispatch({
            actionType: Constants.FACEBOOK_GETTING_PICTURE,
            data: null
        })
        
        window.FB.api(`/${userId}/picture?type=large`, (response) => {
            FacebookDispatcher.dispatch({
                actionType: Constants.FACEBOOK_RECEIVED_PICTURE,
                data: response
            })
        })
    },

    getFacebookPosts: (userId) => {

        FacebookDispatcher.dispatch({
            actionType: Constants.FACEBOOK_GETTING_POSTS,
            data: null
        })
        
        window.FB.api(`/${userId}?fields=feed.limit(250){likes.limit(1).summary(true),with_tags,message_tags,created_time}`, (response) => {
            console.log(response);
            FacebookDispatcher.dispatch({
                actionType: Constants.FACEBOOK_RECEIVED_POSTS,
                data: response
            })
        })
    },

    getFacebookPhotos: (userId) => {

        FacebookDispatcher.dispatch({
            actionType: Constants.FACEBOOK_GETTING_PHOTOS,
            data: null
        })
        
        window.FB.api(`/${userId}?fields=photos.limit(250){likes.limit(1).summary(true)}`, (response) => {
            console.log(response);
            FacebookDispatcher.dispatch({
                actionType: Constants.FACEBOOK_RECEIVED_PHOTOS,
                data: response
            })
        })
    },

    getFacebookFriends: (userId) => {

        FacebookDispatcher.dispatch({
            actionType: Constants.FACEBOOK_GETTING_FRIENDS,
            data: null
        })
        
        window.FB.api(`/${userId}?fields=friends.summary(true)`, (response) => {
            console.log(response);
            FacebookDispatcher.dispatch({
                actionType: Constants.FACEBOOK_RECEIVED_FRIENDS,
                data: response
            })
        })
    }
}

module.exports = FacebookActionCreators;