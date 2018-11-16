// Code for platform detection
var isMaterial = Framework7.prototype.device.ios === false;
var isIos = Framework7.prototype.device.ios === true;

// Add the above as global variables for templates
Template7.global = {
  material: isMaterial,
  ios: isIos,
};

var mainView;

// A template helper to turn ms durations to mm:ss
// We need to be able to pad to 2 digits
function pad2(number) {
  if (number <= 99) { number = ('0' + number).slice(-2); }
  return number;
}

// Now the actual helper to turn ms to [hh:]mm:ss
function durationFromMsHelper(ms) {
  if (typeof ms != 'number') {
    return '';
  }
  var x = ms / 1000;
  var seconds = pad2(Math.floor(x % 60));
  x /= 60;
  var minutes = pad2(Math.floor(x % 60));
  x /= 60;
  var hours = Math.floor(x % 24);
  hours = hours ? pad2(hours) + ':' : '';
  return hours + minutes + ':' + seconds;
}

// A stringify helper
// Need to replace any double quotes in the data with the HTML char
//  as it is being placed in the HTML attribute data-context
function stringifyHelper(context) {
  var str = JSON.stringify(context);
  return str.replace(/"/g, '&quot;');
}

// Finally, register the helpers with Template7
Template7.registerHelper('durationFromMs', durationFromMsHelper);
Template7.registerHelper('stringify', stringifyHelper);

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

if (!isIos) {
  // Change class
  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
  // And move Navbar into Page
  $$('.view .navbar').prependTo('.view .page');
}

// Initialize app
var myApp = new Framework7({
  material: isIos? false : true,
  template7Pages: true,
  precompileTemplates: true,
  swipePanel: 'left',
  swipePanelActiveArea: '30',
  swipeBackPage: true,
  animateNavBackIcon: true,
  pushState: !!Framework7.prototype.device.os,
});
function rawjsonSuccess(result)
  {
      var title = result.title;
      var message  = result.message;
      var rawjson = result.json;
      alert("raw json callback. \ntitle: " + title + ", message: " + message + ", json: " + rawjson + ".");
  }
  function pushDataSuccess(result)
  {
      var action = result.action;
      var msgid = result.msgid;
      var title = result.title;
      var message  = result.message;
      var data = result.data;
      alert("custom dialog callback. \naction: " + action + ", msgid: " + msgid + ", title: " + title + ", message: " + message + ", data: " + data + ".");
      window.sh.sendPushResult(msgid, 1); //let continue as accept
  }
  function pushResultSuccess(result)
  {
      var pushresult = result.result;
      var action = result.action;
      var msgid = result.msgid;
      var title = result.title;
      var message  = result.message;
      var data = result.data;
      alert("push result callback. \nresult: " + pushresult + ", action: " + action + ", msgid: " + msgid + ", title: " + title + ", message: " + message + ", data: " + data + ".");
  }
  function feedItemSuccess(result)
    {
        for (i = 0; i < result.length; i++)
        {
            var feed = result[i];
            alert("Fetch feed and send ack/result: " + JSON.stringify(feed));
            //feed ack
            sh.reportFeedAck(feed.feed_id);
            //feed result
            sh.notifyFeedResult(feed.feed_id, "", "accepted", false, false);
        }
    }
    function notifyNewFeedSuccess()
    {
        alert("New feed found.");
    }
    function failCallback(result) {    alert("Fail: " + result);}
function init() {
  // Add view
  mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
  });

  // Handle Cordova Device Ready Event
  $$(document).on('deviceready', function deviceIsReady() {
        console.log('Device is ready!');
        var sh = cordova.require("com.streethawk.core.Streethawk");
        window['sh'] = sh;
        sh.streethawkinit();
        sh.shSetEnableLogs(true);
        sh.setAppKey("phonegapeskd");
        //default location and notification
        sh.shSetDefaultLocationService(false); //not promote location permission until enable
        sh.shGetLocationEnabled(function(result){alert("location enabled: " + result)}, failCallback);
        sh.shSetDefaultNotificationService(false); //not promote notification permission until enable
        sh.shGetNotificationEnabled(function(result){alert("notification enabled: " + result)}, failCallback);
        
        //init
        
		    //sh.shSetiTunesId("507040546");
		    //sh.shSetGcmSenderId("666472741872");
        sh.shGetAppKey(function(result){alert("app key: " + result)}, failCallback);
        sh.shiTunesId(function(result){alert("itunes id: " + result)}, failCallback);
        // sh.setAdvertisementId("BEE83220-9385-4B36-81E1-BF4305834093");

        //change default settings
        sh.shSetLocationEnabled(true);
        sh.shGetLocationEnabled(function(result){alert("location enabled: " + result)}, failCallback);
        sh.shSetNotificationEnabled(true);
        sh.shGetNotificationEnabled(function(result){alert("notification enabled: " + result)}, failCallback);

        //tag
        // sh.tagCuid("myidentifier123456", function(result){alert("tag cuid result: " + result)}, failCallback);
        // sh.tagUserLanguage("test language");
        // sh.tagNumeric("numeric_key", 5, function(result){alert("tag numeric result: " + result)}, failCallback);
        // sh.tagString("string_key", "liked", function(result){alert("tag string result: " + result)}, failCallback);
        // sh.tagString("sh_phone", "abcdefg", function(result){alert("tag sh_phone result: " + result)}, failCallback);
        // sh.tagString("sh_phone", "+123456", function(result){alert("tag sh_phone result: " + result)}, failCallback);
        // sh.tagString("sh_email", "anurag@streethawk.com");
        // sh.tagDatetime("date_key", "2016-6-18", function(result){alert("tag datetime result: " + result)}, failCallback);
        // sh.incrementTag("numeric_key", function(result){alert("increment tag result: " + result)}, failCallback);
        // sh.incrementTagWithValue("numeric_key", 100, function(result){alert("increment tag with value result: " + result)}, failCallback);
        // sh.removeTag("numeric_key", function(result){alert("remove tag result: " + result)}, failCallback);

        //view enter/exit
        sh.notifyViewEnter("index.html");
        sh.notifyViewExit("index.html");

        //feedback
        sh.shSendSimpleFeedback("feedback title", "hello, this is feedback message");

        //install id
        sh.getInstallId(function(result){alert("install id: " + result)}, failCallback);

        //install register successfully
        sh.registerInstallEventCallback(function(result){alert("register install: " + result)}, failCallback);

        //sdk version
        sh.getSHLibraryVersion(function(result){alert("sdk version: " + result)}, failCallback);

        //streethawk format time
        sh.getCurrentFormattedDateTime(function(result){alert("current time: " + result)}, failCallback);
        //sh.getFormattedDateTime(60*60*1000, function(result){alert("formatted time: " + result)}, failCallback);

        //alert setting
        sh.shSetAlertSetting(60, function(){}, failCallback);
        sh.shGetAlertSettings(function(result){alert("alert settings: " + result)}, failCallback);

        //open url
        sh.shDeeplinking(function(result){alert("open url: " + result)}, failCallback);

        //launch page
        sh.shRegisterViewCallback(function(result){alert("launch page by callback: " + result)}, failCallback);

        //raw json

        sh.shRawJsonCallback(rawjsonSuccess, failCallback);
    
        //custom confirm dialog

        sh.pushDataCallback(pushDataSuccess, failCallback);
    
        //handle push result
   
        sh.pushResultCallback(pushResultSuccess, failCallback);
    
        //none StreetHawk payload
        sh.registerNonSHPushPayloadObserver(function(result){alert("none StreetHawk payload callback: " + JSON.stringify(result))}, failCallback);
    
        //set interactive button pairs
        // sh.addInteractivePushButtonPairWithIcons("button1", "icon1", "button2", "icon2", "pair1");
        // sh.addInteractivePushButtonPairWithIcons("Invite", "", "Test", "", "InviteTest");
        // sh.addInteractivePushButtonPair("agree", "disagree", "Agree_Disagree");
        // sh.setInteractivePushBtnPair();

        //fetch feed and send feed ack/result

        sh.registerFeedItemCallback(feedItemSuccess, failCallback);
        //sh.shGetFeedDataFromServer(0);


        sh.notifyNewFeedCallback(notifyNewFeedSuccess, failCallback);

        //pointzi
        //sh.originateShareWithCampaign("child_campaign", "dialog", "medium", "content", "term", "shsamplepg://launchvc?path=value", "http://www.streethawk.com", function(result){alert("pointzi share url: " + result)}, failCallback);
        //sh.originateShareWithSourceSelection("child_campaign", "shsamplepg://launchvc?path=value", "http://www.streethawk.com");

        //geofence enter/exit callback
        sh.setNotifyGeofenceEventCallback(function(result){alert("geofence enter/exit callback: " + JSON.stringify(result))}, failCallback);

        //beacon enter/exit callback
        sh.setNotifyBeaconDetectCallback(function(result){alert("beacon enter/exit callback: " + JSON.stringify(result))}, failCallback);

        //location set report work home only
        //sh.reportWorkHomeLocationOnly(true);
            
        //location set location update frequency
        //sh.updateLocationMonitoringParams(1, 2, 3, 4);
        //ios not use
        //sh.setUseCustomDialog(false);
        sh.forcePushToNotificationBar(true);
        //sh.getIcon("icon_name");
        //sh.startBeaconMonitoring();
        //sh.stopBeaconMonitoring();
        //sh.shEnterBeacon();
        //sh.shExitBeacon();
        //sh.setLargeIconResID("large icon");
        //sh.setSmallIconResID("small icon");
  });
  $$(document).on('click', '.panel .search-link', function searchLink() {
    // Only change route if not already on the index
    //  It would be nice to have a better way of knowing this...
    var indexPage = $$('.page[data-page=index]');
    if (indexPage.hasClass('cached')) {
      mainView.router.load({
        pageName: 'index',
        animatePages: false,
        reload: true,
      });
    }
  });

  $$(document).on('click', '.panel .favorites-link', function searchLink() {
    // @TODO fetch the favorites (if any) from localStorage
    var favorites = JSON.parse(localStorage.getItem('favorites'));
    mainView.router.load({
      template: myApp.templates.favorites,
      animatePages: false,
      context: {
        tracks: favorites,
      },
      reload: true,
    });
  });
  $$(document).on('submit', '#search', searchSubmit);
}

/**
 * Search
 *  - functionality for the main search page
 */

function searchSubmit(e) {
  var formData = myApp.formToJSON('#search');
  e.preventDefault();
  if (!formData.term) {
    myApp.alert('Please enter a search term', 'Search Error');
    return;
  }

  if (formData.filter === 'all') {
    formData.term = formData.term.trim();
  } else {
    formData.term = formData.filter + ':' + formData.term.trim();
  }
  delete formData.filter;
  formData.media = 'music';
  $$('input').blur();
  myApp.showPreloader('Searching');
  $$.ajax({
    dataType: 'json',
    data: formData,
    processData: true,
    url: 'https://itunes.apple.com/search',
    success: function searchSuccess(resp) {
      var results = { count: 0 };
      results.count = resp.resultCount === 25 ? "25 (max)" : resp.resultCount;
      results.items = resp.results;
      myApp.hidePreloader();
      mainView.router.load({
        template: myApp.templates.results,
        context: {
          tracks: results,
        },
      });
    },
    error: function searchError(xhr, err) {
      myApp.hidePreloader();
      myApp.alert('An error has occurred', 'Search Error');
      console.error("Error on ajax call: " + err);
      console.log(JSON.stringify(xhr));
    }
  });
}


/**
 * Details page
 *  - controls the playback controls and preview media object
 */

var mediaPreview = null;
var mediaTimer = null;

function playbackControlsClickHandler(e) {
  var buttonTarget = $$(e.target);
  if (buttonTarget.hasClass('play')) {
    monitorMediaPreviewCurrentPosition(mediaPreview);
    mediaPreview.play();
    setPlaybackControlsStatus('pending');
    return;
  }
  monitorMediaPreviewCurrentPosition();
  mediaPreview.stop();
  setPlaybackControlsStatus('stopped');
  return;
};

function setPlaybackControlsStatus(status) {
  var allButtons = $$('.playback-controls a');
  var playButton = $$('.playback-controls .play-button');
  var pendingButton = $$('.playback-controls .pending-button');
  var stopButton = $$('.playback-controls .stop-button');
  switch (status) {
    case 'stopped':
      allButtons.removeClass('displayed');
      playButton.addClass('displayed');
      break;
    case 'pending':
      allButtons.removeClass('displayed');
      pendingButton.addClass('displayed');
      break;
    case 'playing':
      allButtons.removeClass('displayed');
      stopButton.addClass('displayed');
      break;
    default:
      allButtons.removeClass('displayed');
      playButton.addClass('displayed');
  }
}

function monitorMediaPreviewCurrentPosition(media) {
  var percent = 0;
  var progressbar = $$('.playback-controls .duration .progressbar');
  // If no media object is provided, stop monitoring
  if (!media) {
    clearInterval(mediaTimer);
    return;
  }
  mediaTimer = setInterval(function () {
    media.getCurrentPosition(
      function (position) {
        if (position > -1) {
          percent = (position / media.getDuration()) * 100;
          myApp.setProgressbar(progressbar, percent);
        }
      },
      function (e) {
        console.error("Error getting position", e);
      });
  }, 100);
}

function mediaPreviewSuccessCallback() {
  var progressbar = $$('.playback-controls .duration .progressbar');
  setPlaybackControlsStatus('stopped');
  myApp.setProgressbar(progressbar, 0, 100);
}

function mediaPreviewErrorCallback(error) {
  setPlaybackControlsStatus('stopped');
  console.error(error);
}

function mediaPreviewStatusCallback(status) {
  var progressbar = $$('.playback-controls .duration .progressbar');
  switch (status) {
    case 2: // playing
      setPlaybackControlsStatus('playing');
      myApp.setProgressbar(progressbar, 0, 0);
      break;
    case 4: // stopped
      setPlaybackControlsStatus('stopped');
      break;
    default:
      // Default fall back not needed
  }
}

function addOrRemoveFavorite(e) {
  if (this.isFavorite) {
    // remove the favorite from the arrays
    this.favoriteIds.splice(this.favoriteIds.indexOf(this.id), 1);
    var favorites = this.favorites.filter(function(fave) {
      return fave.id !== this.id;
    }, this);
    this.favorites = favorites;
    this.isFavorite = false;
    // update the UI
    $$('.link.star').html('<i class="fa fa-star-o"></i>');
  } else {
    // add the favorite to the arrays
    if (this.favorites === null) this.favorites = [];
    this.favorites.push(this.track);
    this.favoriteIds.push(this.id);
    this.isFavorite = true;
    // update the UI
    $$('.link.star').html('<i class="fa fa-star"></i>');
  }
  if (this.favorites.length === 0) {
    // clear it out so the template knows it's empty when it returns
    //  as {{#if favorites}} sees an empty array as truthy
    this.favorites = null;
  }
  // save it back to localStorage
  localStorage.setItem('favorites', JSON.stringify(this.favorites));
  localStorage.setItem('favoriteIds', JSON.stringify(this.favoriteIds));
  // if we got here from the favorites page, we need to reload its context
  //  so it will update as soon as we go "back"
  if (this.fromPage === 'favorites') {
    // Reload the previous page
    mainView.router.load({
      template: myApp.templates.favorites,
      context: {
        tracks: this.favorites,
      },
      reload: true,
      reloadPrevious: true,
    });
  }
}

myApp.onPageInit('details', function(page) {
  var previewUrl = page.context.previewUrl;
  if (typeof Media !== 'undefined') {
    // Create media object on page load so as to let it start buffering right
    //  away...
    mediaPreview = new Media(previewUrl, mediaPreviewSuccessCallback,
      mediaPreviewErrorCallback, mediaPreviewStatusCallback);
  } else {
    // Create a dummy media object for when viewing in a browser, etc
    //  this really is optional, using `phonegap serve` polyfills the
    //  Media plugin
    function noMedia() {
      myApp.alert('Media playback not supported', 'Media Error');
      setTimeout(function() {
        setPlaybackControlsStatus('stopped');
        mediaPreviewStatusCallback(4); // stopped
        console.error('No media plugin available');
      }, 0);
    }
    mediaPreview = {
      play: noMedia,
      stop: function() {},
      release: function() {},
      getCurrentPosition: function() {},
    };
  }

  // fetch the favorites
  var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  var favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
  var isFavorite = false;
  if (favoriteIds.indexOf(page.context.id) !== -1) {
    $$('.link.star').html('<i class="fa fa-star"></i>');
    isFavorite = true;
  }
  // set up a context object to pass to the handler
  var pageContext = {
    track: page.context,
    id: page.context.id,
    isFavorite: isFavorite,
    favorites: favorites,
    favoriteIds: favoriteIds,
    fromPage: page.fromPage.name,
  };

  // bind the playback and favorite controls
  $$('.playback-controls a').on('click', playbackControlsClickHandler);
  $$('.link.star').on('click', addOrRemoveFavorite.bind(pageContext));
});

myApp.onPageBeforeRemove('details', function(page) {
  // stop playing before leaving the page
  monitorMediaPreviewCurrentPosition();
  mediaPreview.stop();
  mediaPreview.release();
  // keep from leaking memory by removing the listeners we don't need
  $$('.playback-controls a').off('click', playbackControlsClickHandler);
  $$('.link.star').off('click', addOrRemoveFavorite);
});
