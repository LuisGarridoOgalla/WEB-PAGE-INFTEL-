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
================================================================================
Twitter API utility functions
================================================================================
*/
var tw = ( function()
{
    var cb;
    
    
    function initCB()
    {
        cb = new Codebird();
        
        cb.setBearerToken(CONFIG.BEARER_TOKEN);
    }
    
    
    
    return {
        /*
        ========================================================================
        Search in the Twitter database for 100 tweets created in the last 7 days
        that countain a specific query string and geocode.

        Parameters:
            querystr: String containing the query, ex: #myhashtag OR "a srt" ETC
            geocode:  String containing the geocode
                      Ex: 37.781157 -122.398720 1mi

        Returns: Promise - An object containing:
                 tweets: An array of Tweets
                 rate:   The remaining and total API query limit
                 err:    An error message, EX: Timeouts
        ========================================================================
        */
        searchTweetsByStrNGeo: async function ( strquery, geocode )
        {
            if ( cb === undefined )    initCB();
            
            
            var params = {
                q:          strquery,
                geocode:    geocode,
                resultType: "recent",
                count:      "100"
            };

            var ret = {tweets : undefined, rate : undefined, err : undefined};
            
            
            try {
                await cb.__call(
                            "search_tweets",
                            params,
                            function (reply, rate, err)
                            {
                                ret.tweets = reply.statuses;
                                ret.rate   = rate;
                                ret.err    = err;
                            },
                            true // this parameter required
                        );
            } catch(e) {
                ret.err = "Unknow error!";
            }

            return ret;
        }
    };
} )();