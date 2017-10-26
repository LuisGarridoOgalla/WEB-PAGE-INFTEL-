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

<<<<<<< HEAD

function searchTweetsByStrNGeo(hashtag, geocode, callback) {
    // Get Tweets

   var cb = new Codebird();

    cb.setBearerToken(CONFIG.BEARER_TOKEN);
    
     
=======
function searchTweetsByStrNGeo(hashtag, geocode, callback) {
    // Get Tweets

    var cb = new Codebird();

    cb.setBearerToken(CONFIG.BEARER_TOKEN);
>>>>>>> d16c32a9f54d821e797dba0f85dd40bb555eeac7

    var params = {
        q: hashtag,
        resultType: "recent",
        count: "100"
    };

    var tweets;

    cb.__call(
            "search_tweets",
            params,
<<<<<<< HEAD
            callback,
=======
            function (reply, rate, err) {
                callback(reply.statuses);
            },
>>>>>>> d16c32a9f54d821e797dba0f85dd40bb555eeac7
            true // this parameter required
            );
}
;

<<<<<<< HEAD
function render(tweets, rate, err) {
    tweets = tweets.statuses;
    
    console.log(tweets)
    
    var infowindow = new google.maps.InfoWindow()

    var marker, tweet;
    var nombrelibro = document.getElementById("textoBuscador").value.toLowerCase() + " #facultaduma";
    for (tweet of tweets) {
        console.log(tweet);
        var simil = similarity(nombrelibro, tweet.text);
        if (simil >= 0.5 || nombrelibro===" #facultaduma") {
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
=======
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
>>>>>>> d16c32a9f54d821e797dba0f85dd40bb555eeac7
        }
    }
}

function funcionlupa() {
<<<<<<< HEAD
    searchTweetsByStrNGeo("#facultaduma", "37.781157 -122.398720 1mi", render);
}
function funcionclean(){
      setMapOnAll(null);
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
=======
    searchTweetsByStrNGeo("#facultaduma", "37.781157 -122.398720 1mi", function (tweets) {
        render(tweets);
    });
>>>>>>> d16c32a9f54d821e797dba0f85dd40bb555eeac7
}