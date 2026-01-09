// Initialize Google Map
function initMap() {
    // Check if map element exists
    var mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API not loaded');
        // Fallback to iframe embed - using search query
        var searchQuery = encodeURIComponent('Cavite State University Carmona Campus Philippines');
        mapElement.innerHTML = '<iframe src="https://www.google.com/maps?q=' + searchQuery + '&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        return;
    }

    try {
        // Location: Cavite State University - Carmona Campus, Philippines
        // Coordinates: 14.3167° N, 121.0500° E
        var myLatlng = { lat: 14.3167, lng: 121.0500 };
        
        // Create map with options
        var map = new google.maps.Map(mapElement, {
            zoom: 16,
            center: myLatlng,
            scrollwheel: false,
            styles: [
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "hue": "#ff0000"
                        }
                    ]
                }
            ]
        });
        
        // Add marker at the location
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Cavite State University - Carmona Campus'
        });
        
        // Add info window
        var infoWindow = new google.maps.InfoWindow({
            content: '<div style="padding: 10px;"><strong>Cavite State University - Carmona Campus</strong><br>Carmona, Cavite, Philippines</div>'
        });
        
        // Open info window by default
        infoWindow.open(map, marker);
        
        // Also open on marker click
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        
        // Try to geocode for more precise location (optional enhancement)
        var geocoder = new google.maps.Geocoder();
        var address = 'Cavite State University - Carmona Campus, Philippines';
        
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK' && results[0]) {
                // Update map center and marker position to geocoded location
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
                infoWindow.setPosition(results[0].geometry.location);
            }
        });
    } catch (error) {
        console.error('Error initializing map:', error);
        // Fallback to iframe embed - using search query
        var searchQuery = encodeURIComponent('Cavite State University Carmona Campus Philippines');
        mapElement.innerHTML = '<iframe src="https://www.google.com/maps?q=' + searchQuery + '&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    }
}

// Fallback function if API fails to load
function initMapFallback() {
    var mapElement = document.getElementById('map');
    if (mapElement) {
        // Use Google Maps embed (no API key required) - using search query
        var searchQuery = encodeURIComponent('Cavite State University Carmona Campus Philippines');
        mapElement.innerHTML = '<iframe src="https://www.google.com/maps?q=' + searchQuery + '&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    }
}