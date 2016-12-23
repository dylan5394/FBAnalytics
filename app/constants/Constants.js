import keyMirror from 'keymirror';

const Constants = {
    FACEBOOK_INITIALIZED: null,

    FACEBOOK_LOGIN_CHANGE: null,
    
    FACEBOOK_GETTING_PICTURE: null,
    FACEBOOK_RECEIVED_PICTURE: null,
    
    FACEBOOK_LOGGED_IN: null,
    FACEBOOK_LOGGED_OUT: null,
    
    IMAGE_UPLOADED: null,

    FACEBOOK_GETTING_POSTS: null,
    FACEBOOK_RECEIVED_POSTS: null,

    FACEBOOK_GETTING_PHOTOS: null,
    FACEBOOK_RECEIVED_PHOTOS: null,

    FACEBOOK_GETTING_FRIENDS: null,
    FACEBOOK_RECEIVED_FRIENDS: null,
}

module.exports = keyMirror(Constants)