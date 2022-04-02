//checking if user is logged in
if (!sessionStorage.getItem('token')) {
    window.location.href = 'Login';
}

//making cursor load as we are loading in the data from db
document.querySelector('html').style = 'cursor: wait;';

//first get the user detail mainly the profile photo
let getProfilePhoto = new XMLHttpRequest();
getProfilePhoto.open('GET', `/users/${sessionStorage.getItem('token')}`, true);
getProfilePhoto.onload = () => {
    //when request is loaded and we get response we want to set profile photo
    let profile = JSON.parse(getProfilePhoto.responseText)[0];
    let profilePhoto = profile.imagePath
        ? `/upload/${profile.imagePath}`
        : 'images/default-user.png';
    document.getElementById('profilePhoto').src = profilePhoto;
    $('#profilePhoto').on('load', () => {
        document.getElementById('profilePhoto').style = 'opacity: 1;';
    });
    //we want to save username and profile photo in sessionstorage so no need to get profile request again
    sessionStorage.setItem('profilePhoto', profilePhoto);
    sessionStorage.setItem('username', profile.username);
};
getProfilePhoto.send();

//get the restaurants
let getRestaurants = new XMLHttpRequest();
getRestaurants.open('GET', '/restaurants', true);
getRestaurants.onload = () => {
    //onload, then save restaurant array as an array to Global var, then send get comment request
    Global.restaurantArray = JSON.parse(getRestaurants.responseText);
    let getComments = new XMLHttpRequest();
    getComments.open('GET', '/comments', true);
    getComments.onload = () => {
        //when we get response we also save response to Global var and get user position and then display restaurants
        Global.commentArray = JSON.parse(getComments.responseText);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                Global.latitude = position.coords.latitude;
                Global.longitude = position.coords.longitude;
                displayRestaurants(Global.restaurantArray, null);
            });
        }
    };
    getComments.send();
};
getRestaurants.send();

function displayRestaurants(restaurantArray, searchTerm, fromTags) {
    //get the main parent element where all card going to go in
    let main = document.querySelector('#main');
    //styling our elements back to default
    document
        .querySelector('#mainParent')
        .classList.remove('d-flex', 'justify-content-center');
    main.classList.remove(
        'shadow',
        'mb-5',
        'bg-white',
        'rounded',
        'border',
        'py-5',
        'col-8'
    );
    document.querySelector('#empty').classList.remove('dummySpace');
    document.querySelector('#dummyEmpty').classList.remove('dummySpace');
    document.querySelector('#filter').classList.remove('d-none');
    if (document.querySelector('.collapse')) {
        document.querySelector('.collapse').classList.remove('d-none');
    }
    //resetting our main element
    main.innerHTML = '';
    //our array of tags we will use to interpret data from db
    let masterTags = [
        'halal',
        'fastFood',
        'fineDining',
        'western',
        'asian',
        'fusion'
    ];
    //iterating through restaurantArray
    for (let i = 0; i < restaurantArray.length; i++) {
        //formatting name
        let name = restaurantArray[i].name;
        //get specific comments for the current restaurant
        let comments = [];
        Global.commentArray.forEach((comment) => {
            if (comment.restaurantId == restaurantArray[i]._id) {
                comments.push(comment);
            }
        });
        //calculating avg rating of the comments for the restaurant
        let totalRating = 0;
        let count = 0;
        for (let index = 0; index < comments.length; index++) {
            totalRating += comments[index].rating;
            count++;
        }
        let avgRating = 0;
        if (count > 0) {
            avgRating = totalRating / count;
        }
        //rounding avg rating to 2 dec places
        avgRating = Math.round(avgRating * 100) / 100;
        //calculate distance in km between user pos and restaurant pos using haversine formula
        let differenceInLatitude =
            restaurantArray[i]['location-latitude'] * (Math.PI / 180) -
            Global.latitude * (Math.PI / 180);
        let differenceInLongitude =
            restaurantArray[i]['location-longitude'] * (Math.PI / 180) -
            Global.longitude * (Math.PI / 180);
        let a =
            Math.pow(Math.sin(differenceInLatitude / 2), 2) +
            Math.cos(
                restaurantArray[i]['location-latitude'] * (Math.PI / 180)
            ) *
                Math.cos(Global.latitude * (Math.PI / 180)) *
                Math.pow(Math.sin(differenceInLongitude / 2), 2);
        let c = 2 * Math.asin(Math.sqrt(a));
        //rounding user to 3 dec place so easier conversion to m and km
        let distance = Math.round(c * 6371 * 1000) / 1000;
        //converting to km or m and formatting it to string with units
        if (distance < 1) {
            distance *= 1000;
            distance = distance.toString() + 'm';
        } else {
            distance = Math.round(distance * 100) / 100;
            distance = distance.toString() + 'km';
        }
        //get index of restaurant in restaurantArray so we can use it to access the specific restaurant through the card elment
        let item = Global.restaurantArray.indexOf(restaurantArray[i]);
        //creating the card wiht the data we got above
        let card = `<div class = "card col-lg-2 col-5 shadow m-3 bg-white rounded-0 border p-0 text-start" style="transition: all ease-out .2s" item = "${item}">
                        <div class = "image" onclick = "showRestaurantDetail(this)" item = "${item}">
                            <img class = "card-img-top img img-responsive full-width" src = "${restaurantArray[i].image}">
                        </div>
                        <div class = "card-body py-3">
                            <h5 class = "card-title d-flex justify-content-between">
                                <div id = "name" data-toggle="tooltip" data-placement="top" onclick = "showRestaurantDetail(this)" item = "${item}" title="${restaurantArray[i].name}" class = "overflow" style="cursor:pointer;">${name}</div>
                                <i class = "addToFav bi bi-heart" item = "${item}" style="cursor:pointer;" data-toggle="tooltip" data-placement="bottom" title = "Add to favorites"></i>
                            </h5>
                            <div class = "d-flex justify-content-between align-item-center">
                                <div id = "rating" class = "card-subtitle mb-2"><i class="bi bi-star-fill" style = "color: var(--bgcolor);"></i> <b>${avgRating}</b>/5(${count})</div>
                                <div id = "distance" class = "card-subtitle mb-2">${distance}</div>
                            </div>
                            <p class = "card-text row border-top border-danger pt-2"></p>
                        </div>
                    </div>`;
        //inserting the card into our main elmeent
        main.insertAdjacentHTML('beforeend', card);
        //adding tag elements in the card we just created
        if (restaurantArray[i].tags) {
            //iterate through tag, then clean up the tag and add to the card
            for (tag of restaurantArray[i].tags) {
                let cleanedUpTag = cleanUpTag(tag);
                document.querySelector(
                    `[item = "${item}"] .card-body .card-text`
                ).innerHTML += `<div tag = "${cleanUpTag(
                    tag
                )}" class = "overflow badge bg-primary text-white p-1 m-1 col-3"  data-toggle="tooltip" data-placement="top" title="${cleanUpTag(
                    tag
                )}">${cleanedUpTag}</div>`;
            }
        } else {
            //creation of tag array of restaurant
            let tags = [];
            //iterate through tags in masterTags
            for (let tag of masterTags) {
                //check if restaurant has that tag
                if (restaurantArray[i]['tag-' + tag] == 1) {
                    //if yes, push to tag array, clean up the tag and add the tag to the card
                    tags.push(tag);
                    let cleanedUpTag = cleanUpTag(tag);
                    document.querySelector(
                        `[item = "${item}"] .card-body .card-text`
                    ).innerHTML += `<div tag = "${cleanUpTag(
                        tag
                    )}" class = "overflow badge bg-primary text-white p-1 m-1 col-3"  data-toggle="tooltip" data-placement="top" title="${cleanUpTag(
                        tag
                    )}">${cleanedUpTag}</div>`;
                }
                //afterwards, delete the tag we just iterated through as we are going to switch to tags array
                delete Global.restaurantArray[i]['tag-' + tag];
            }
            //add tags array to Global var
            Global.restaurantArray[i].tags = tags;
        }
    }
    //iterating through each tag element and making them all clickable
    document.querySelectorAll('[tag]').forEach((element) => {
        //add styling and eventlistener for click
        element.style = 'cursor: pointer;';
        element.addEventListener('click', (event) => {
            //animation class
            event.target.classList.add('selected');
            // event.target.addEventListener('animation')
            event.target.addEventListener('animationend', (e) => {
                e.target.classList.remove('selected');
                //get tag we want to filter, and all the checkboxes used to filter
                let tag = event.target.getAttribute('tag');
                let checkbox = document.querySelectorAll('[id^="tag"]');
                //iterate thru each checkbox to find which checkbox to click
                checkbox.forEach((item) => {
                    //get label for checkbox as we want to know which tag element should be clicked
                    let label = document.querySelector(
                        `label[for="${item.id}"]`
                    );
                    if (label.innerHTML == tag) {
                        //scroll to top if restaurant is below tags
                        window.scrollTo({
                            top: item.offsetTop,
                            behavior: 'smooth'
                        });
                        //show tags if not shown
                        let filterableTags =
                            document.getElementById('filterableTags');
                        if (filterableTags.classList.contains('show') != true) {
                            $('#filterableTags').collapse('show');
                        }
                        //checking the tag and dispatching event so we can filter restaurants
                        item.checked = true;
                        item.dispatchEvent(new Event('change'));
                    }
                });
            });
            //finally add the stylings
            document.querySelector('#filter').classList.add('bold');
        });
        //if session storage has tag => restaurantDetails.js tags click event, we want to check the tag and filter restaurant using that tag
        if (sessionStorage.getItem('tag')) {
            if (element.getAttribute('tag') == sessionStorage.getItem('tag')) {
                sessionStorage.removeItem('tag');
                element.dispatchEvent(new Event('click'));
            }
        }
    });

    //get favorite method with param true because we want to display the hearts
    getFavs(true);

    //add click event to heart so we can add or remove from fav
    document.querySelectorAll('.addToFav').forEach((heart) => {
        heart.addEventListener('click', (event) => {
            //get the heart which was clicked and get which restaurant it was from
            let heartEle = event.target;
            let restaurant = restaurantArray[heartEle.getAttribute('item')];
            //check if it is in fav or not
            if (heartEle.classList.contains('bi-heart')) {
                //if not in fav, we want to add to fav
                let addToFav = new XMLHttpRequest();
                addToFav.open(
                    'POST',
                    `/favorites/${sessionStorage.getItem('token')}`,
                    true
                );
                addToFav.setRequestHeader('Content-Type', 'application/json');
                addToFav.onload = () => {
                    //onload, we make response into a javascript objec
                    let response = JSON.parse(addToFav.responseText);
                    //check if we actually added to fav
                    if (response.affectedRows == 1) {
                        //if yes we will style the heart
                        heartEle.classList.remove('bi-heart');
                        heartEle.classList.add('bi-heart-fill', 'selected');
                        $(heartEle).attr('title', 'Remove from favorites');
                        $(heartEle).on('animationend', (event) => {
                            event.target.classList.remove('selected');
                        });
                        //and call getFavs method with param false so as to not display heart but to only update the favoriteArray in Global var
                        getFavs(false);
                    }
                };
                addToFav.send(JSON.stringify({ restaurantId: restaurant._id }));
            } else {
                //we need to delete the fav so we need the if of teh fav
                let selectedFavId;
                Global.favoriteArray.forEach((fav) => {
                    if (fav.restaurantID == restaurant._id) {
                        selectedFavId = fav._id;
                    }
                });
                //we send delete request
                let deleteFav = new XMLHttpRequest();
                deleteFav.open(
                    'DELETE',
                    `/favorites/${sessionStorage.getItem('token')}`,
                    true
                );
                deleteFav.setRequestHeader('Content-Type', 'application/json');
                deleteFav.onload = () => {
                    //check if deleted successfully
                    let response = JSON.parse(deleteFav.responseText);
                    if (response.affectedRows == 1) {
                        //if yes style the heart and update the Global array
                        heartEle.classList.add('bi-heart');
                        heartEle.classList.remove('bi-heart-fill');
                        $(heartEle).attr('title', 'Add to favorites');
                        getFavs(false);
                    }
                };
                deleteFav.send(JSON.stringify({ favoriteId: selectedFavId }));
            }
        });
    });

    //make sure the filter element is visible first
    document.querySelector('#filter').classList.remove('d-none');

    //check the restaurant array given to the method
    if (restaurantArray.length == 0) {
        //style the elements
        main.classList.add(
            'shadow',
            'bg-white',
            'mb-5',
            'rounded',
            'border',
            'py-5',
            'col-8'
        );
        document
            .querySelector('#mainParent')
            .classList.add('d-flex', 'justify-content-center');
        //check why it is empty either through searching or filtering
        if (searchTerm) {
            //style the empty page
            main.innerHTML = `<h1 class = "failedH1" style = "font-size: 2rem;">We could not find any matches for your searched term</h1><br><br>
                              <p style="font-size: 1rem;">Please double check your search for any spelling mistakes or you could try again with a different search item.</p>`;
            document.querySelector('.collapse').classList.add('d-none');
            document.querySelector('#filter').classList.add('d-none');
            document.querySelector('#empty').classList.add('dummySpace');
        } else if (fromTags) {
            //style the empty page
            main.innerHTML = `<h1 class = "failedH1" style = "font-size: 2rem">We could not find any matches for the above filters</h1>`;
            document.querySelector('#dummyEmpty').classList.add('dummySpace');
        }
    }
    //since we finished loading our page we can put back our cursor style
    document.querySelector('html').style = 'cursor: context-menu';
}

function getFavs(display) {
    // get favorites
    let getFavs = new XMLHttpRequest();
    getFavs.open('GET', `/favorites/${sessionStorage.getItem('token')}`, true);
    getFavs.onload = () => {
        //whent we get response, we want to save array to Global var
        Global.favoriteArray = JSON.parse(getFavs.responseText);
        //if we want display we display each card's heart to show if it is in fav or not
        if (display) {
            //iterate through all heart elements
            document.querySelectorAll('.addToFav').forEach((heart) => {
                //check if heart elment's restaurant is in fav
                Global.favoriteArray.forEach((fav) => {
                    if (
                        fav.restaurantID ==
                        Global.restaurantArray[heart.getAttribute('item')]._id
                    ) {
                        //if yes we update the heart
                        heart.classList.remove('bi-heart');
                        heart.classList.add('bi-heart-fill');
                        $(heart).attr('title', 'Remove from favorites');
                    }
                });
            });
        }
    };
    getFavs.send();
}

//the method which cleans up the tag passed in
function cleanUpTag(tag) {
    switch (tag) {
        case 'halal':
            return 'Halal';
        case 'fastFood':
            return 'Fast Food';
        case 'fineDining':
            return 'Fine Dining';
        case 'western':
            return 'Western Cuisine';
        case 'asian':
            return 'Asian Cuisine';
        case 'fusion':
            return 'Fusion Cuisine';
    }
}

//function to be executed when restaurant card is clicked
function showRestaurantDetail(element) {
    //get index of restaurant
    let restaurantPosition = element.getAttribute('item');
    //save to Global var and finally saving to sessionStorage to be interpreted by restaurantDetails.js
    // Global.currentRestaurantIndex = restaurantPosition;
    sessionStorage.setItem('global', JSON.stringify(Global));
    //send user to restaurantDetails.html
    window.location.href = Global.restaurantArray[restaurantPosition].name;
}

//method executed whenever something is typed into the search box
function filterRestaurants(searchedTerm) {
    //get restaurantArray
    let restaurantArray = Global.restaurantArray;
    //check if filters are in place
    if (
        document.querySelectorAll('input[type="checkbox"]:checked').length > 0
    ) {
        //if yes we reset the restaurantArray and then add the restaurant cards displayed
        restaurantArray = [];
        let shown = document.querySelectorAll('.card[item]');
        shown.forEach((item) => {
            let index = item.getAttribute('item');
            restaurantArray.push(Global.restaurantArray[index]);
        });
    }
    //filteredRestaurantArray is going to be the array passed into displayRestaurants method
    let filteredRestaurantArray = [];
    //resetting the main element
    document.querySelector('#main').innerHTML = '';
    //check if the searchedTerm is empty or not
    if (searchedTerm) {
        //if not empty, we format string to lower case
        searchedTerm = searchedTerm.toLowerCase();
        //iterate through restaurantArray
        for (let i = 0; i < restaurantArray.length; i++) {
            //format restaurant name to lowercase
            let restaurantName = restaurantArray[i].name.toLowerCase();
            //check if searched term is in the name
            if (restaurantName.indexOf(searchedTerm) != -1) {
                //if yes we push restaurant to filtered array
                filteredRestaurantArray.push(restaurantArray[i]);
            }
        }
        //finally we display restaurants using filtered array
        displayRestaurants(filteredRestaurantArray, searchedTerm);
    } else {
        //if empty, we display the master restaurantArray and then dispatch event so that we can filter the restaurants again
        displayRestaurants(restaurantArray, searchedTerm);
        $('input[type="checkbox"]').trigger('change');
    }
}

//function executed when filter button is clicked so we can style it
function toggleClass(element, className) {
    element.classList.toggle(className);
}

//add event to all filter checkboxes 'change'
$('input[type="checkbox"]').on('change', () => {
    //when tag is pressed, we reset search value
    document.querySelector('#search').value = '';
    //get all checked element and all the checkboxes
    let checked = document.querySelectorAll('input[type="checkbox"]:checked');
    let unchecked = document.querySelectorAll('input[type="checkbox"]');
    //reset the checkboxes
    unchecked.forEach((input) => {
        let label = document.querySelector(`label[for="${input.id}"]`);
        label.classList.remove('btn-danger', 'active');
        label.classList.add('btn-secondary');
    });
    //getting the tags which were checked
    let checkedTags = [];
    for (let i = 0; i < checked.length; i++) {
        //styling the label
        let id = checked[i].id;
        let label = document.querySelector('label[for="' + id + '"');
        label.classList.add('btn-danger', 'active');
        label.classList.remove('btn-secondary');
        //put the value of the checkbox into array
        checkedTags.push(checked[i].value);
    }
    //filtering restaurants using checkedtags array
    filterRestaurantsByTag(checkedTags);
});

function filterRestaurantsByTag(tagsToBeFiltered) {
    //check if tags passed are empty or not
    if (tagsToBeFiltered.length > 0) {
        //if not empty we get restaurant array
        let restaurantArray = Global.restaurantArray;
        //filteredArray used to display restaurants
        let filteredArray = [];
        //iterate through array
        restaurantArray.forEach((restaurant) => {
            //get tags of restaurant
            let restaurantTags = restaurant.tags;
            //check if the array tagsToBeFiltered's items are all in restaurantTags
            let containsAllTags = tagsToBeFiltered.every((tag) =>
                restaurantTags.includes(tag)
            );
            if (containsAllTags) {
                //if true, means the restaurant has the tags and we must push it to filtered array
                filteredArray.push(restaurant);
            }
        });
        //finally displaying restaurant
        displayRestaurants(filteredArray, null, true);
    } else {
        //if empty reset the restaurants shown
        displayRestaurants(Global.restaurantArray);
    }
}

function logout() {
    //removing event listeners
    $('#homePageModal').unbind('shown.bs.modal');
    $('#homePageModal').unbind('hidden.bs.modal');
    //show modal
    $('#homePageModal').modal('show');
    document.querySelector('#homePageModalTitle').innerHTML =
        sessionStorage.getItem('username') + "'s Log out";
    document.querySelector('#homePageModal .modal-body').innerHTML =
        'Successfully logged out of the account <b>' +
        sessionStorage.getItem('username') +
        '</b>.<br>';
    //when closed, remove all items from sessionStorage
    $('#homePageModal').on('hidden.bs.modal', () => {
        //iterate thru sessionstorage properties
        for (let key in sessionStorage) {
            //try catch because some properties may not be able to be removed by removeItem()
            try {
                sessionStorage.removeItem(key);
            } catch (error) {
                //if error, means we removed all the items that are supposed to be removed and we can break out of the loop
                break;
            }
        }
        //bringing user to Login page becuase he logged out
        window.location.href = 'Login';
    });
}
