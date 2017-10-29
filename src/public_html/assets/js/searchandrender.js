/* 
 * The MIT License
 *
 * Copyright 2017 Anthony Gaudino, Iván Corbacho, Luís Garrido, Pablo Ramírez
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


"use strict";
/*
 ===============================================================================
 Main code to perform book searches
 ===============================================================================
 */
var snr = ( function()
{
    let fuseOptions =
    {
        shouldSort:         true,
        threshold:          0.6,
        location:           0,
        distance:           100,
        maxPatternLength:   32,
        minMatchCharLength: 1,
        keys:               [ "text" ]
    };
    /*
    ============================================================================
    Render the results on a Google Map by using markers with content.

    Parameters:
            tweets:   An array containing tweets and it's data
            bookName: The string (book name) the user is looking for

    Returns: Nothing
    ============================================================================
    */
    function render( tweets, bookName )
    {
        // Delete all old markers before adding more
        gmap.deleteMarkers();
        
        if ( tweets === undefined || tweets.length === 0 )    return;
        
        // Removes all tweets that aren't geotagged
        //----------------------------------------------------------------------
        tweets.forEach( function( tweet ) {
            if (    tweet.geo === undefined
                 || tweet.geo === null 
                 || tweet.geo.coordinates[0] === undefined
                 || tweet.geo.coordinates[0] === null )
            {
               tweets.splice( tweets.indexOf( tweet ), 1 );
            }
        });
        
        if ( tweets.length === 0 )    return;
        
        
        // Check if tweets have the requested query string in a fuzzy way
        //----------------------------------------------------------------------
        if ( bookName || bookName.length > 0 )
        {
            let fuse = new Fuse( tweets, fuseOptions );
            
            tweets   = fuse.search( bookName );
        }
        
        
        for ( const tweet of tweets )
        {
            
            gmap.addMarkerWMessage( {lat: tweet.geo.coordinates[0], lng: tweet.geo.coordinates[1]},
                                    "<h4>" + tweet.user.screen_name + "</h4>"          +
                                    "<p>"  + tweet.text             + "</p>"           +
                                    "<p>"  + "<a href="             + DATA.TWITTER_URL +
                                    tweet.user.screen_name + " target='_blank'>Talk to me!</a>" + "</p>" );
        }
    }
    
    
    
    return {
        /*
        ========================================================================
        Executes a search when the user clicks on the search button.
        ========================================================================
        */
        execSearch: async function ()
        {
            let bookName      = document.getElementById( "searchField" ).value.toLowerCase();
            // Gets the center of map coordenates
            let centerOfMap   = gmap.getMapCenter();
            let radius        = Math.round( gmap.getBounds() / 1000 );
            let coordsNRadius = centerOfMap.lat + "," + centerOfMap.lng + "," + radius + "km";
            
            let twAPIQueryRes;


            try
            {
                twAPIQueryRes = await tw.searchTweetsByStrNGeo( CONFIG.HASHTAG, coordsNRadius );
            } catch ( e )
            {
                console.log( "Unknow error!" );
            }


            render( twAPIQueryRes.tweets, bookName );
        }
    };
} )();