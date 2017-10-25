"use strict";
/*
 ================================================================================
 Gets the all tweets in the last 7 days that countain a specific string and
 geocode.
 
 Parameters:
 hashtag: String containing the hashtag, ex: #myhashtag
 geocode: String containing the geocode, ex: 37.781157 -122.398720 1mi
 
 Returns: nothing
 ================================================================================
 */
var map;
var infoWindow;
function initMap() {
    var centerWorld = {lat: 0, lng: 0};
    infoWindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: Math.round(Math.log($(window).width() / 512)) + 1,
        center: centerWorld
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("We think you're here!<br><br>If not please drag the map to where you are.");
            infoWindow.open(map);

            map.setCenter(pos);
            map.setZoom(12);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function searchTweetsByStrNGeo(hashtag, geocode, callback) {
    // Get Tweets

    var cb = new Codebird();

    cb.setBearerToken(CONFIG.BEARER_TOKEN);

    var params = {
        q: hashtag,
        resultType: "recent",
        count: "100"
    };

    var tweets;

    cb.__call(
            "search_tweets",
            params,
            function (reply, rate, err) {
                callback(reply.statuses);
            },
            true // this parameter required
            );
}
;

function render(tweets) {
    console.log(tweets)

    var infowindow = new google.maps.InfoWindow()

    var marker, tweet;

    for (tweet of tweets) {
        console.log(tweet);
        console.log(tweet.geo.coordinates[0], tweet.geo.coordinates[1])
        if (tweet.geo.coordinates[0] !== null) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]),
                map: map
                        //tweets[i].text -- tweets[i].user.name -- tweets[i].user.screen_name  // (Tweet text,Twitter user name, user real name)
            });

            google.maps.event.addListener(marker, 'click', (function (marker, tweet) {
                return function () {
                    infowindow.setContent("<h4>" + tweet.user.screen_name + "</h4>" +
                            "<p>" + tweet.text + "</p>");
                    infowindow.open(map, marker);
                };
            })(marker, tweet));
        } else {
            console.log(tweet)
        }
    }
}

function funcionlupa() {
    searchTweetsByStrNGeo("#facultaduma", "37.781157 -122.398720 1mi", function (tweets) {
        render(tweets);
    });
}