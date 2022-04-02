if (!sessionStorage.getItem('token')) {
    window.location.href = 'Login';
}
document.querySelector('html').style = 'cursor: wait;';

let getProfilePhoto = new XMLHttpRequest();
getProfilePhoto.open('GET', `/users/${sessionStorage.getItem('token')}`, true);
getProfilePhoto.onload = () => {
    let profile = JSON.parse(getProfilePhoto.responseText)[0];
    let profilePhoto = profile.imagePath
        ? `/upload/${profile.imagePath}`
        : 'images/default-user.png';
    document.getElementById('profilePhoto').src = profilePhoto;
    $('#profilePhoto').on('load', () => {
        document.getElementById('profilePhoto').style = 'opacity: 1;';
    });
    sessionStorage.setItem('profilePhoto', profilePhoto);
    sessionStorage.setItem('username', profile.username);
    document.querySelector('title').innerText = `${sessionStorage.getItem(
        'username'
    )}'s Favorite Restaurants - ClickToEat`;
};
getProfilePhoto.send();

let getRestaurants = new XMLHttpRequest();
getRestaurants.open('GET', '/restaurants', true);
getRestaurants.onload = () => {
    Global.restaurantArray = JSON.parse(getRestaurants.responseText);
    let getComments = new XMLHttpRequest();
    getComments.open('GET', '/comments', true);
    getComments.onload = () => {
        Global.commentArray = JSON.parse(getComments.responseText);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                Global.latitude = position.coords.latitude;
                Global.longitude = position.coords.longitude;
                // displayRestaurants(Global.restaurantArray, null);
                let restaurantArray = [];
                let getFavs = new XMLHttpRequest();
                getFavs.open(
                    'GET',
                    '/favorites/' + sessionStorage.getItem('token'),
                    true
                );
                getFavs.onload = () => {
                    Global.favoriteArray = JSON.parse(getFavs.responseText);
                    Global.favoriteArray.forEach((fav) => {
                        Global.restaurantArray.forEach((restaurant) => {
                            if (restaurant._id == fav.restaurantID) {
                                restaurantArray.push(restaurant);
                            }
                        });
                    });
                    Global.restaurantArray = restaurantArray;
                    if (Global.restaurantArray.length > 0) {
                        displayRestaurants(Global.restaurantArray, null);
                    } else {
                        document.querySelector('html').style = 'cursor: null;';
                        let main = document.querySelector('#main');
                        main.classList.add(
                            'shadow',
                            'bg-white',
                            'mb-5',
                            'rounded',
                            'border',
                            'py-5',
                            'col-8',
                            'd-flex',
                            'flex-column',
                            'align-items-center'
                        );
                        document
                            .querySelector('#mainParent')
                            .classList.add('d-flex', 'justify-content-center');
                        main.innerHTML = `<h1 class = "failedH1" style = "font-size: 2rem;">There are no favorite restaurants to display here</h1>
                                          <p style="font-size: 1rem;">Try adding a restaurant to favorites <a href = 'Home'>here</a>.</p>`;
                        document
                            .querySelector('.collapse')
                            .classList.add('d-none');
                        document
                            .querySelector('#filter')
                            .classList.add('d-none');
                        document
                            .querySelector('#empty')
                            .classList.add('dummySpace');
                        document.querySelector('input').classList.add('d-none');
                        document
                            .querySelector('button')
                            .classList.add('d-none');
                    }
                };
                getFavs.send();
            });
        }
    };
    getComments.send();
};
getRestaurants.send();

function displayRestaurants(restaurantArray, searchTerm, fromTags) {
    let main = document.querySelector('#main');
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
    main.innerHTML = '';
    document.querySelector('#empty').classList.remove('dummySpace');
    document.querySelector('#dummyEmpty').classList.remove('dummySpace');
    document.querySelector('#filter').classList.remove('d-none');
    if (document.querySelector('.collapse')) {
        document.querySelector('.collapse').classList.remove('d-none');
    }
    let masterTags = [
        'halal',
        'fastFood',
        'fineDining',
        'western',
        'asian',
        'fusion'
    ];
    for (let i = 0; i < restaurantArray.length; i++) {
        //for name
        let name = restaurantArray[i].name;
        //calculate avg for restaurant
        let comments = [];
        for (let index = 0; index < Global.commentArray.length; index++) {
            if (
                Global.commentArray[index].restaurantId ==
                restaurantArray[i]._id
            ) {
                comments.push(Global.commentArray[index]);
            }
        }
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
        avgRating = Math.round(avgRating * 100) / 100;
        //calculate distance
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
        let distance = Math.round(c * 6371 * 1000) / 1000;
        if (distance < 1) {
            distance *= 1000;
            distance = distance.toString() + 'm';
        } else {
            distance = Math.round(distance * 100) / 100;
            distance = distance.toString() + 'km';
        }
        //master index
        let item = Global.restaurantArray.indexOf(restaurantArray[i]);
        let card = `<div class = "card col-lg-2 col-sm-5 shadow m-3 bg-white rounded border p-0 text-start" style="transition: all ease-out .2s" item = "${item}">
                        <div class = "image" onclick = "showRestaurantDetail(this)" item = "${item}">
                            <img class = "card-img-top img img-responsive full-width" src = "${restaurantArray[i].image}">
                        </div>
                        <div class = "card-body py-3">
                            <h5 class = "card-title d-flex justify-content-between">
                                <div id = "name" data-toggle="tooltip" data-placement="top" onclick = "showRestaurantDetail(this)" class = "overflow" item = "${item}" title="${restaurantArray[i].name}" style="cursor:pointer;">${name}</div>
                                <i class = "addToFav bi bi-heart" item = "${item}" style="cursor:pointer;" data-toggle="tooltip" data-placement="bottom" title = "Add to favorites"></i>
                            </h5>
                            <div class = "d-flex justify-content-between align-item-center">
                                <div id = "rating" class = "card-subtitle mb-2"><i class="bi bi-star-fill" style = "color: var(--bgcolor);"></i> <b>${avgRating}</b>/5(${count})</div>
                                <div id = "distance" class = "card-subtitle mb-2">${distance}</div>
                            </div>
                            <p class = "card-text row border-top border-danger pt-2"></p>
                        </div>
                    </div>`;
        main.insertAdjacentHTML('beforeend', card);
        //putting tags in the card created
        if (restaurantArray[i].tags) {
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
            let tags = [];
            for (let tag of masterTags) {
                if (restaurantArray[i]['tag-' + tag] == 1) {
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
                delete Global.restaurantArray[i]['tag-' + tag];
            }
            Global.restaurantArray[i].tags = tags;
        }
    }
    //making the tags clickabable
    document.querySelectorAll('[tag]').forEach((element) => {
        element.style = 'cursor: pointer;';
        element.addEventListener('click', (event) => {
            event.target.classList.add('selected');
            event.target.addEventListener('animationend', (e) => {
                e.target.classList.remove('selected');
                let tag = event.target.getAttribute('tag');
                let checkbox = document.querySelectorAll('[id^="tag"]');
                checkbox.forEach((item) => {
                    let label = document.querySelector(
                        `label[for="${item.id}"]`
                    );
                    if (label.innerHTML == tag) {
                        window.scrollTo({
                            top: item.offsetTop,
                            behavior: 'smooth'
                        });
                        let filterableTags =
                            document.getElementById('filterableTags');
                        if (filterableTags.classList.contains('show') != true) {
                            $('#filterableTags').collapse('show');
                        }
                        item.checked = true;
                        item.dispatchEvent(new Event('change'));
                    }
                });
            });
            document.querySelector('#filter').classList.add('bold');
        });
    });

    getFavs(true);

    document.querySelectorAll('.addToFav').forEach((heart) => {
        heart.addEventListener('click', (event) => {
            let heartEle = event.target;
            let restaurant = restaurantArray[heartEle.getAttribute('item')];
            if (heartEle.classList.contains('bi-heart')) {
                let addToFav = new XMLHttpRequest();
                addToFav.open(
                    'POST',
                    `/favorites/${sessionStorage.getItem('token')}`,
                    true
                );
                addToFav.setRequestHeader('Content-Type', 'application/json');
                addToFav.onload = () => {
                    let response = JSON.parse(addToFav.responseText);
                    if (response.affectedRows == 1) {
                        heartEle.classList.remove('bi-heart');
                        heartEle.classList.add('bi-heart-fill', 'selected');
                        $(heartEle).attr('title', 'Remove from favorites');
                        $(heartEle).on('animationend', (event) => {
                            event.target.classList.remove('selected');
                        });
                        getFavs(false);
                    }
                };
                addToFav.send(JSON.stringify({ restaurantId: restaurant._id }));
            } else {
                let selectedFavId;
                Global.favoriteArray.forEach((fav) => {
                    if (fav.restaurantID == restaurant._id) {
                        selectedFavId = fav._id;
                    }
                });
                let deleteFav = new XMLHttpRequest();
                deleteFav.open(
                    'DELETE',
                    `/favorites/${sessionStorage.getItem('token')}`,
                    true
                );
                deleteFav.setRequestHeader('Content-Type', 'application/json');
                deleteFav.onload = () => {
                    let response = JSON.parse(deleteFav.responseText);
                    if (response.affectedRows == 1) {
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

    document.querySelector('#filter').classList.remove('d-none');
    if (restaurantArray.length == 0) {
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
        if (searchTerm) {
            main.innerHTML = `<h1 class = "failedH1" style = "font-size: 2rem;">We could not find any matches for your searched term</h1><br><br>
                              <p style="font-size: 1rem;">Please double check your search for any spelling mistakes or you could try again with a different search item.</p>`;
            document.querySelector('.collapse').classList.add('d-none');
            document.querySelector('#filter').classList.add('d-none');
            document.querySelector('#empty').classList.add('dummySpace');
        } else if (fromTags) {
            main.innerHTML = `<h1 class = "failedH1" style = "font-size: 2rem">We could not find any matches for the above filters</h1>`;
            document.querySelector('#dummyEmpty').classList.add('dummySpace');
        }
    }
    document.querySelector('html').style = 'cursor: context-menu';
}

function getFavs(display) {
    let getFavs = new XMLHttpRequest();
    getFavs.open('GET', `/favorites/${sessionStorage.getItem('token')}`, true);
    getFavs.onload = () => {
        Global.favoriteArray = JSON.parse(getFavs.responseText);
        if (display) {
            document.querySelectorAll('.addToFav').forEach((heart) => {
                Global.favoriteArray.forEach((fav) => {
                    if (
                        fav.restaurantID ==
                        Global.restaurantArray[heart.getAttribute('item')]._id
                    ) {
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

function showRestaurantDetail(element) {
    let restaurantPosition = element.getAttribute('item');
    sessionStorage.setItem('global', JSON.stringify(Global));
    window.location.href = Global.restaurantArray[restaurantPosition].name;
}

function filterRestaurants(searchedTerm) {
    let restaurantArray = Global.restaurantArray;
    if (
        document.querySelectorAll('input[type="checkbox"]:checked').length > 0
    ) {
        restaurantArray = [];
        let shown = document.querySelectorAll('.card[item]');
        shown.forEach((item) => {
            let index = item.getAttribute('item');
            restaurantArray.push(Global.restaurantArray[index]);
        });
    }
    let filteredRestaurantArray = [];
    document.querySelector('#main').innerHTML = '';
    if (searchedTerm) {
        searchedTerm = searchedTerm.toLowerCase();
        for (let i = 0; i < restaurantArray.length; i++) {
            let restaurantName = restaurantArray[i].name.toLowerCase();
            if (restaurantName.indexOf(searchedTerm) != -1) {
                filteredRestaurantArray.push(restaurantArray[i]);
            }
        }
        displayRestaurants(filteredRestaurantArray, searchedTerm);
    } else {
        displayRestaurants(restaurantArray, searchedTerm);
        $('input[type="checkbox"]').trigger('change');
    }
}

function toggleClass(element, className) {
    element.classList.toggle(className);
}

$('input[type="checkbox"]').on('change', () => {
    document.querySelector('#search').value = '';
    let checked = document.querySelectorAll('input[type="checkbox"]:checked');
    let unchecked = document.querySelectorAll('input[type="checkbox"]');
    unchecked.forEach((input) => {
        let label = document.querySelector(`label[for="${input.id}"]`);
        label.classList.remove('btn-danger', 'active');
        label.classList.add('btn-secondary');
    });
    let checkedTags = [];
    for (let i = 0; i < checked.length; i++) {
        let id = checked[i].id;
        let label = document.querySelector('label[for="' + id + '"');
        label.classList.add('btn-danger', 'active');
        label.classList.remove('btn-secondary');
        checkedTags.push(checked[i].value);
    }
    filterRestaurantsByTag(checkedTags);
});

function filterRestaurantsByTag(tagsToBeFiltered) {
    if (tagsToBeFiltered.length > 0) {
        let restaurantArray = Global.restaurantArray;
        let filteredArray = [];
        // $('.card[item]').hide();
        restaurantArray.forEach((restaurant) => {
            let restaurantTags = restaurant.tags;
            let containsAllTags = tagsToBeFiltered.every((tag) =>
                restaurantTags.includes(tag)
            );
            if (containsAllTags) {
                filteredArray.push(restaurant);
            }
        });
        displayRestaurants(filteredArray, null, true);
    } else {
        displayRestaurants(Global.restaurantArray);
    }
}

function logout() {
    $('#homePageModal').unbind('shown.bs.modal');
    $('#homePageModal').unbind('hidden.bs.modal');
    $('#homePageModal').modal('show');
    document.querySelector('#homePageModalTitle').innerHTML =
        sessionStorage.getItem('username') + "'s Log out";
    document.querySelector('#homePageModal .modal-body').innerHTML =
        'Successfully logged out of the account <b>' +
        sessionStorage.getItem('username') +
        '</b>.<br>';
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
