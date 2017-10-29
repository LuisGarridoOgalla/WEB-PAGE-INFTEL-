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
Google Maps API utility functions
================================================================================
*/
var gmap = ( function()
{
    let map;
    
    let userPos;
    let userPosWindow;
    let errWindow;
    let markerWindow;
    let markers = [];
    
    
    
    /*
    ============================================================================
    Try to find out where the user is by using the browsers geolocation
    ============================================================================
    */
    async function getBrowserGeo()
    {
        let geoOptions = {
            enableHighAccuracy: true,
            timeout:            10000,
            maximumAge:         0
        };

        let geoResult;  // Storage for geolocation result
        
        
        try
        {
            geoResult = await geoloc.getBrowserGeo( geoOptions );
        } catch ( e )
        {
            handleBrowserLocationError( e );
            return;
        }
        
        userPos = { lat: geoResult.coords.latitude, lng: geoResult.coords.longitude };

        userPosWindow = new google.maps.InfoWindow;

        userPosWindow.setPosition( userPos );
        userPosWindow.setContent("We think you're here!<br><br>If not, please drag the map to where you are.");
        map.setCenter( userPos );
        map.setZoom( 12 );

        userPosWindow.open( map );
    }
    
    
    
    /*
    ============================================================================
    Handles errors when trying to acquire user location by broser.
    
    Parameters:
        err: The error, may be a string or an error object
    ============================================================================
    */
    function handleBrowserLocationError( err )
    {
        errWindow = new google.maps.InfoWindow;

        errWindow.setPosition(map.getCenter());
        
        errWindow.setContent( err.message );

        errWindow.open(map);
    }
    
    
    
    /*
    ============================================================================
    Adds a marker to the map
    
    Parameters:
        location: An object containing the latitude and longitude
    
    Returns: A marker object
    ============================================================================
    */
    function addMarker( location )
    {
        let marker = new google.maps.Marker({
            position: location,
            map: map
        });
        
        markers.push(marker);
        
        return marker;
    }

        
    
    /*
    ============================================================================
    Changes the map reference for all markers
    ============================================================================
    */
    function setMapOnAllMarkers( map )
    {
        for (const m of markers)    m.setMap(map);
    }

    
    
    
    /*
    ============================================================================
    Remove all user geolocation and error infowindows after 2 seconds after user
    starts dragging on the map.
    ============================================================================
    */
    function removeInfowindowsOnDragListener()
    {
        map.addListener( 'dragstart', function() {

            let infowindows = [userPosWindow, errWindow];


            window.setTimeout(function() {
                infowindows.forEach(function( infow )
                {
                    if ( infow !== null && infow !== undefined )
                    {
                        google.maps.event.clearInstanceListeners( infow );
                        infow.close();
                        infow = null;
                    }
                });
            }, 2000);
        });
    }
    
    
    
    return {
        /*
        ========================================================================
        Initializes the GMap, and asks the user permission to acquire it's
        position.
        ========================================================================
        */
        initMap: async function()
        {
            let centerOfWorld = {lat: 0, lng: 0};
            
            
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: Math.round(Math.log($(window).width() / 512)) + 1,
                center: centerOfWorld
            });
            
            removeInfowindowsOnDragListener();
            
            
            // Try to obtain user position
            // -----------------------------------------------------------------
            getBrowserGeo();
        },
        
        
        
        /*
        ========================================================================
        Return the coordinates of the center of the map.
        ========================================================================
        */
        getMapCenter: function()
        {
            let centerOfMap = map.getCenter();
            
            return { lat: centerOfMap.lat(), lng: centerOfMap.lng() };
        },
    
    
    
        /*
        ========================================================================
        Adds a marker to the map with an on-click message

        Parameters:
            location: An object containing the latitude and longitude
            message:  A HTML formatted string to be shown in the infowindow
        ========================================================================
        */
        addMarkerWMessage: function( location, message )
        {
            let marker = addMarker( location );


            marker.addListener('click', function() {
                markerWindow = new google.maps.InfoWindow;
                
                markerWindow.setContent( message );

                markerWindow.open( map, marker );
            });
        },
        
        
    
        /*
        ========================================================================
        Removes all markers from the map
        ========================================================================
        */
        deleteMarkers: function()
        {
            setMapOnAllMarkers(null);
            markers = [];
        },
        
        
        
        /*
        ========================================================================
        Gets the map bounds in meters
        
        Returns: The map bounds in meters
        ========================================================================
        */
        getBounds: function()
        {
            let bounds = map.getBounds();
            
            return google.maps.geometry.spherical.computeDistanceBetween(bounds.getNorthEast(), bounds.getSouthWest());
        }
    };
} )();