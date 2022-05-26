const params = new URL(location.href).searchParams;
const restaurantName = params.get('r').replace('%zy81', '&');
let latitude = params.get('lat');
let longitude = params.get('lon');

function getRestaurantList() {
    return new Promise((resolve, reject) => {
        let getRestaurants = new XMLHttpRequest();
        getRestaurants.open('GET', '/restaurants', true);
        getRestaurants.onload = () => {
            resolve(JSON.parse(getRestaurants.responseText));
        };
        getRestaurants.send();
    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    });
}

let map;
let marker;
let user;
let userMarker;
let infoWindow;
let userInfo;
function initMap() {
    getRestaurantList()
        .then((restaurantList) => {
            let requestRestaurant;
            for (restaurant of restaurantList) {
                if (
                    restaurant.name.toLowerCase() ==
                    restaurantName.toLowerCase()
                ) {
                    requestRestaurant = restaurant;
                }
            }

            let buildingUnit = requestRestaurant['location-building'];
            let building = buildingUnit.slice(buildingUnit.indexOf(',') + 2);
            let unit = buildingUnit.slice(0, buildingUnit.indexOf(','));
            let street = requestRestaurant['location-street'];
            let postalCode = requestRestaurant['location-postalCode'];
            let address = `${building} ${street}<br>${unit}<br>Singapore ${postalCode}`;
            let mapAddress = `<b style = "font-weight: 600;">${requestRestaurant.name}</b><br>${address}`;
            let restaurantLocation = new google.maps.LatLng(
                parseFloat(requestRestaurant['location-latitude']),
                parseFloat(requestRestaurant['location-longitude'])
            );
            let user = new google.maps.LatLng(latitude, longitude);
            map = new google.maps.Map(document.getElementById('myMap'), {
                center: restaurantLocation,
                zoom: 16
            });
            marker = new google.maps.Marker({
                position: restaurantLocation,
                map: map,
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/restaurant.png'
                }
            });
            userMarker = new google.maps.Marker({
                position: user,
                map: map
            });
            infoWindow = new google.maps.InfoWindow({
                content: mapAddress,
                maxWidth: 700
            });
            userInfo = new google.maps.InfoWindow({
                content: 'Your Location',
                maxWidth: 700
            });
            google.maps.event.addListener(marker, 'click', () => {
                infoWindow.open(map, marker);
            });
            google.maps.event.addListener(userMarker, 'click', () => {
                userInfo.open(map, userMarker);
            });
        })
        .catch((e) => {
            console.log(e);
        });
}
