# Sharing Tweet Books

Sharing Tweet Books is a small JS client side application with the purpose of help people share books.

On this application, if someone wants to share a book he/she should create a Tweet on Twitter with a specific hashtag and a text, usually the book name and some more information. A user on Sharing Tweet Books can then find those tweets by searching with a map for the book he is interested, the search is made using a map so that the user can search on a nearby area.

## Inner workings

The application uses a Twitter API application token, which allows to search only 100 maximum tweets per API call, and only tweets created in the last 7 days. It would actually be possible to retrieve more tweets and maybe older ones, but the application is don't have this implemented.
Tweets are searched by:
* **Hashtag**: we are using a hard coded one;
* **String**: usually the book name;
* **Geolocation**: latitude and longitude and a search radius.

When a user access the application it should receive a dialog asking him to share his location, this is useful, because searches are based on location and without it the user would have to pan and zoom to where he wants to search.

When the user searches, we calculate the search area based on the map zoom and location, if the map shows all of Britain for example, we would search the whole Britain, if it's showing only a city, Southampton, for example, it would search only is this city area.

Since Twitter string search is exact, it we search for **hous**, it wouldn't find **house**, we actually have to search for all tweets in the area and then filter them out using a library that allows to compare strings in a fuzzy way.

## Known bugs

JS libraries are being loaded asynchronously this means that errors may arise if a library that depends of another is loaded first, for example, Bootstrap loading before JQuery rises an error since it depends on the latter.

## Knows limitations

The JS code uses very recent syntax (ECMAScript 7) and so should only work on very recent browsers.
