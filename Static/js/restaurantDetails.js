if (!sessionStorage.getItem('token')) {
    window.location.href = 'Login';
}
let Global = JSON.parse(sessionStorage.getItem('global'));

let restaurantName = decodeURI(
    window.location.href.slice(
        window.location.href.indexOf('/public/') + '/public/'.length
    )
);
Global.restaurantArray.forEach((restaurant, index) => {
    if (restaurant.name == restaurantName)
        Global.currentRestaurantIndex = index;
});
if (!Global.currentRestaurantIndex && Global.currentRestaurantIndex != 0) {
    // console.log('in');
    window.location.href = 'Login';
}

document.getElementById('restaurantBrand').src =
    Global.restaurantArray[Global.currentRestaurantIndex].image;
document.getElementById('restaurantName').innerHTML =
    Global.restaurantArray[Global.currentRestaurantIndex].name;
document.getElementById('restaurantDescription').innerText =
    Global.restaurantArray[Global.currentRestaurantIndex].description;
document.querySelector('title').innerText =
    Global.restaurantArray[Global.currentRestaurantIndex].name +
    ' - ClickToEat';

window.addEventListener('resize', initMap);

document.getElementById('profilePhoto').src =
    sessionStorage.getItem('profilePhoto');
$('#profilePhoto').on('load', () => {
    document.getElementById('profilePhoto').style = 'opacity: 1;';
});

let cropper = new Image();
cropper.onload = () => {
    let width = cropper.naturalWidth;
    let height = cropper.naturalHeight;

    let aspectRatio = width / height;

    let croppedWidth = width;
    let croppedHeight = height;
    if (aspectRatio > 1) {
        croppedWidth = height;
    } else if (aspectRatio < 1) {
        croppedHeight = width;
    }

    let outputX = (croppedWidth - width) * 0.5;
    let outputY = (croppedHeight - height) * 0.5;

    let croppedImage = document.createElement('canvas');
    croppedImage.width = croppedWidth;
    croppedImage.height = croppedHeight;
    let context = croppedImage.getContext('2d');
    context.drawImage(cropper, outputX, outputY);
    document.getElementById('createCommentProfile').src =
        croppedImage.toDataURL();
    $('#createCommentProfile').on('load', () => {
        let height = document.getElementById('create').offsetHeight;
        height *= 1.8;
        document.getElementById(
            'createCommentProfile'
        ).style = `opacity: 1; border-radius: 50%; height: ${height}px; width: ${height}px;`;
        displayComments();
    });
};
cropper.src = sessionStorage.getItem('profilePhoto');

function selectInput() {
    let selectedMode = Array.from(
        document.querySelector('#selectedMode').getElementsByTagName('div')
    );
    selectedMode.forEach((div) => {
        div.classList.remove('d-none');
    });
    let cancel = document.querySelector('#buttonGroup button');
    $(cancel).on('click', () => {
        selectedMode.forEach((div) => {
            div.classList.add('d-none');
        });
        let stars = document.querySelectorAll('#ratings i');
        stars.forEach((star) => {
            star.classList.remove('bi-star-fill');
            star.classList.add('bi-star');
        });
        document.querySelector('#create').value = '';
    });
    let submit = document.querySelector('#buttonGroup button:last-child');
    $(submit).on('click', createComment);
}

function createComment(event) {
    event.stopImmediatePropagation();
    let review = document.querySelector('#create').value;
    if (!review) return false;
    let stars = document.querySelectorAll('#ratings i');
    let rating = 0;
    if (stars.length > 0) {
        for (let i = 0; i < stars.length; i++) {
            if (stars[i].classList.contains('bi-star-fill')) {
                rating++;
            } else {
                break;
            }
        }
    }
    let createComment = new XMLHttpRequest();
    createComment.open(
        'POST',
        `/comments/${sessionStorage.getItem('token')}`,
        true
    );
    createComment.setRequestHeader('Content-Type', 'application/json');
    createComment.onload = () => {
        $('#buttonGroup button').trigger('click');
        displayComments();
    };
    createComment.send(
        JSON.stringify({
            restaurantId:
                Global.restaurantArray[Global.currentRestaurantIndex]._id,
            restaurant:
                Global.restaurantArray[Global.currentRestaurantIndex].name,
            username: sessionStorage.getItem('username'),
            review: review,
            rating: rating
        })
    );
}

function showRating(event) {
    let star = event.target;
    let rating = star.getAttribute('number');
    let allStars = event.target.parentElement.querySelectorAll('i');
    allStars.forEach((star) => {
        star.classList.remove('bi-star-fill');
        star.classList.add('bi-star');
    });
    for (let i = 0; i < rating; i++) {
        let star = allStars[i];
        star.classList.remove('bi-star');
        star.classList.add('bi-star-fill');
    }
    event.target.parentElement.parentElement.parentElement
        .querySelector('input')
        .dispatchEvent(new Event('input'));
}

let openingHours = [];
let days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
];
for (day of days) {
    let openingClosingHour = [day];
    openingClosingHour.push(
        Global.restaurantArray[Global.currentRestaurantIndex][
            day + '-openingHours'
        ]
    );
    openingClosingHour.push(
        Global.restaurantArray[Global.currentRestaurantIndex][
            day + '-closingHours'
        ]
    );
    openingHours.push(openingClosingHour);
}
let now = new Date();
openingHours.forEach((dayOpeningClosingHours) => {
    let option = document.querySelector(
        `option[value=${dayOpeningClosingHours[0]}]`
    );
    option.innerText +=
        dayOpeningClosingHours[1] + ' to ' + dayOpeningClosingHours[2];
    let today = days[now.getDay()];
    if (option.getAttribute('value') == today) {
        option.selected = true;
        option.disabled = false;
    }
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        Global.latitude = position.coords.latitude;
        Global.longitude = position.coords.longitude;
    });
}

let buildingUnit =
    Global.restaurantArray[Global.currentRestaurantIndex]['location-building'];
let building = buildingUnit.slice(buildingUnit.indexOf(',') + 2);
let unit = buildingUnit.slice(0, buildingUnit.indexOf(','));
let street =
    Global.restaurantArray[Global.currentRestaurantIndex]['location-street'];
let postalCode =
    Global.restaurantArray[Global.currentRestaurantIndex][
        'location-postalCode'
    ];
let address = `${building} ${street}<br>${unit}<br>Singapore ${postalCode}`;
document.getElementById('address').innerHTML = address;
let mapAddress = `<b style = "font-weight: 600;">${
    Global.restaurantArray[Global.currentRestaurantIndex].name
}</b><br>${address}`;

let map;
let marker;
let user;
let userMarker;
let infoWindow;
let userInfo;
function initMap() {
    let brandHeight = document.querySelector(
        '#restaurantBrandCover'
    ).offsetHeight;
    document.getElementById('myMap').style = `height: ${brandHeight}px;`;
    let restaurantLocation = new google.maps.LatLng(
        parseFloat(
            Global.restaurantArray[Global.currentRestaurantIndex][
                'location-latitude'
            ]
        ),
        parseFloat(
            Global.restaurantArray[Global.currentRestaurantIndex][
                'location-longitude'
            ]
        )
    );
    let user = new google.maps.LatLng(Global.latitude, Global.longitude);
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
}

let favId;

function getFavs(display) {
    let getFav = new XMLHttpRequest();
    getFav.open('GET', `/favorites/${sessionStorage.getItem('token')}`, true);
    getFav.onload = () => {
        let favArray = JSON.parse(getFav.responseText);
        if (display) {
            document
                .querySelector('.addToFav')
                .classList.remove('bi-heart-fill');
            document.querySelector('.addToFav').classList.add('bi-heart');
        }
        favArray.forEach((fav) => {
            if (
                fav.restaurantID ==
                Global.restaurantArray[Global.currentRestaurantIndex]._id
            ) {
                if (display) {
                    document
                        .querySelector('.addToFav')
                        .classList.remove('bi-heart');
                    document
                        .querySelector('.addToFav')
                        .classList.add('bi-heart-fill');
                    $('.addToFav').attr('title', 'Remove from favorites');
                }
                favId = fav._id;
            }
        });
    };
    getFav.send();
}

getFavs(true);

document.querySelector('.addToFav').addEventListener('click', (event) => {
    let heart = event.target;
    if (heart.classList.contains('bi-heart-fill')) {
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
                $('.addToFav').attr('title', 'Add to favorites');
                getFavs(true);
            }
        };
        deleteFav.send(JSON.stringify({ favoriteId: favId }));
    } else {
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
                let heartEle = document.querySelector('.addToFav');
                heartEle.classList.remove('bi-heart');
                heartEle.classList.add('bi-heart-fill', 'selected');
                $(heartEle).attr('title', 'Remove from favorites');
                $(heartEle).on('animationend', (event) => {
                    event.target.classList.remove('selected');
                });
                getFavs(false);
            }
        };
        addToFav.send(
            JSON.stringify({
                restaurantId:
                    Global.restaurantArray[Global.currentRestaurantIndex]._id
            })
        );
    }
});

let masterContact = [
    'phoneNum',
    'socialMedia-Twitter',
    'socialMedia-Facebook',
    'website'
];
masterContact.forEach((key) => {
    let details = document.querySelector('#Details');
    let classOfIcon;
    let inner;
    let href;
    if (
        Global.restaurantArray[Global.currentRestaurantIndex]['contact-' + key]
    ) {
        switch (key) {
            case 'website':
                classOfIcon = 'bi-globe';
                href =
                    Global.restaurantArray[Global.currentRestaurantIndex][
                        'contact-' + key
                    ];
                inner = 'Website';
                break;
            case 'socialMedia-Facebook':
                classOfIcon = 'bi-facebook';
                href =
                    Global.restaurantArray[Global.currentRestaurantIndex][
                        'contact-' + key
                    ];
                inner = 'Facebook';
                break;
            case 'socialMedia-Twitter':
                classOfIcon = 'bi-twitter';
                href =
                    Global.restaurantArray[Global.currentRestaurantIndex][
                        'contact-' + key
                    ];
                inner = 'Twitter';
                break;
            case 'phoneNum':
                classOfIcon = 'bi-telephone-fill';
                inner =
                    Global.restaurantArray[Global.currentRestaurantIndex][
                        'contact-' + key
                    ];
                break;
        }
        let atag;
        if (href) {
            atag = `<a href = "${href}" target="_blank">${inner}</a>`;
        } else {
            atag = `<div>${inner}</div>`;
        }
        let html = `<div class = "d-flex">
                        <i class="bi ${classOfIcon} mr-2"></i>
                        ${atag}
                    </div>`;
        details.insertAdjacentHTML('afterbegin', html);
    }
});

let tags = Global.restaurantArray[Global.currentRestaurantIndex].tags;
tags.forEach((tag) => {
    let cleanedUpTag = cleanUpTag(tag);
    let tagCard = `<div tag = "${cleanedUpTag}" class = "badge bg-primary text-white p-2 m-1"  data-toggle="tooltip" data-placement="top" title="${cleanedUpTag}">${cleanedUpTag}</div>`;
    document.querySelector('#tags').insertAdjacentHTML('beforeend', tagCard);
});

document.querySelectorAll('[tag]').forEach((element) => {
    element.style = 'cursor: pointer';
    element.addEventListener('click', () => {
        element.classList.add('selected');
        element.addEventListener('animationend', () => {
            element.classList.remove('selected');
            sessionStorage.setItem('tag', element.getAttribute('tag'));
            window.location.href = 'Home';
        });
    });
});

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

function displayComments() {
    document.querySelector('#comments').innerHTML = '';
    let getComments = new XMLHttpRequest();
    getComments.open('GET', '/comments', true);
    getComments.onload = () => {
        let getLikesOrDislikes = new XMLHttpRequest();
        getLikesOrDislikes.open('GET', '/likeOrDislike', true);
        getLikesOrDislikes.onload = () => {
            let comments = JSON.parse(getComments.responseText);
            let likesOrDislikes = JSON.parse(getLikesOrDislikes.responseText);
            if (comments.length != 0) {
                let commentArray = [];
                comments.forEach((comment) => {
                    if (
                        comment.restaurantId ==
                        Global.restaurantArray[Global.currentRestaurantIndex]
                            ._id
                    ) {
                        commentArray.push(comment);
                    }
                });
                document.getElementById('commentHeader').innerHTML =
                    commentArray.length + ' comments';
                if (commentArray.length == 0) {
                    document.querySelector(
                        '#comments'
                    ).innerHTML = `<div class = "d-flex flex-column align-items-center">
                                                                        <h4>No Reviews for this restaurant.</h4>
                                                                        <h6>Try creating a review for this restaurant!</h6>
                                                                    </div>`;
                } else {
                    let getUserList = new XMLHttpRequest();
                    getUserList.open('GET', '/users', true);
                    getUserList.onload = () => {
                        let userList = JSON.parse(getUserList.responseText);
                        let globalInstance = JSON.parse(
                            sessionStorage.getItem('global')
                        );
                        globalInstance.userArray = userList;
                        sessionStorage.setItem(
                            'global',
                            JSON.stringify(globalInstance)
                        );
                        let datePosted;
                        for (let i = 0; i < commentArray.length; i++) {
                            let [likes, dislikes] = Array(2).fill(0);
                            let likeClass = 'bi-hand-thumbs-up';
                            let dislikeClass = 'bi-hand-thumbs-down';
                            likesOrDislikes.forEach((like) => {
                                if (
                                    like.isLiked == 1 &&
                                    like.isDisliked == 0 &&
                                    like.commentId == commentArray[i]._id
                                ) {
                                    likes++;
                                    if (
                                        like.username ==
                                        sessionStorage.getItem('username')
                                    )
                                        likeClass += '-fill';
                                } else if (
                                    (like.isDisliked =
                                        1 &&
                                        like.isLiked == 0 &&
                                        like.commentId == commentArray[i]._id)
                                ) {
                                    dislikes++;
                                    if (
                                        like.username ==
                                        sessionStorage.getItem('username')
                                    )
                                        dislikeClass += '-fill';
                                }
                            });
                            userList.forEach((user) => {
                                if (user.username == commentArray[i].username) {
                                    let imagePath = user.imagePath
                                        ? `/upload/${user.imagePath}`
                                        : 'images/default-user.png';
                                    let height = document.getElementById(
                                        'createCommentProfile'
                                    ).offsetHeight;
                                    datePosted = new Date(
                                        commentArray[i].datePosted
                                    );
                                    datePosted =
                                        datePosted.toDateString() +
                                        ' ' +
                                        datePosted.toLocaleTimeString();
                                    let comment = `<div class="row m-0 mb-3" index = "${i}">
                                                        <div class="col-1 d-flex justify-content-end p-0">
                                                            <img class = "userProfile" src="${imagePath}" style = "height: ${height}px; width: ${height}px; border-radius: 50%">
                                                        </div>
                                                        <div class = "col-11">
                                                            <div class = "d-flex align-items-center">
                                                                <div class= "mr-2" style= "font-weight: bold;">${user.username}</div>
                                                                <div style="font-size:.8rem">${datePosted}</div>
                                                            </div>
                                                            <div style="font-weight: normal;">${commentArray[i].review}</div>
                                                            <div class = "ratings d-flex">
                                                                <i number="1" class = "bi bi-star"></i>
                                                                <i number="2" class = "bi bi-star"></i>
                                                                <i number="3" class = "bi bi-star"></i>
                                                                <i number="4" class = "bi bi-star"></i>
                                                                <i number="5" class = "bi bi-star"></i>
                                                            </div>
                                                            <div class = "likesOrDislikes d-flex">
                                                                <div class = "like d-flex align-items-center mr-2" style="cursor:pointer">
                                                                    <i index = ${i} class = "bi ${likeClass}"></i>                                                                
                                                                    <p class = "numberLikes m-0" style = "font-size:.8rem;">${likes}</p>
                                                                </div>
                                                                <div class = "dislike d-flex align-items-center" style="cursor:pointer">
                                                                    <i index = ${i} class = "bi ${dislikeClass}"></i>
                                                                    <p class = "numberDislikes m-0" style="font-size:.8rem;">${dislikes}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                    document
                                        .querySelector('#comments')
                                        .insertAdjacentHTML(
                                            'beforeend',
                                            comment
                                        );
                                    let image = document.querySelector(
                                        `#comments .row[index="${i}"] .col-1 img`
                                    );
                                    let cropper = new Image();
                                    cropper.onload = () => {
                                        let width = cropper.naturalWidth;
                                        let height = cropper.naturalHeight;

                                        let aspectRatio = width / height;

                                        let croppedWidth = width;
                                        let croppedHeight = height;
                                        if (aspectRatio > 1) {
                                            croppedWidth = height;
                                        } else if (aspectRatio < 1) {
                                            croppedHeight = width;
                                        }

                                        let outputX =
                                            (croppedWidth - width) * 0.5;
                                        let outputY =
                                            (croppedHeight - height) * 0.5;

                                        let croppedImage =
                                            document.createElement('canvas');
                                        croppedImage.width = croppedWidth;
                                        croppedImage.height = croppedHeight;
                                        let context =
                                            croppedImage.getContext('2d');
                                        context.drawImage(
                                            cropper,
                                            outputX,
                                            outputY
                                        );
                                        image.src = croppedImage.toDataURL();
                                    };
                                    cropper.src = image.src;
                                }
                            });
                            if (
                                commentArray[i].username ==
                                sessionStorage.getItem('username')
                            ) {
                                document
                                    .querySelector(
                                        `#comments>div[index="${i}"]`
                                    )
                                    .classList.add('ownComment');
                                let commentElement = document.querySelector(
                                    `#comments>div[index="${i}"]`
                                );
                                commentElement
                                    .querySelector('div:last-child')
                                    .classList.add(
                                        'd-flex',
                                        'justify-content-between'
                                    );
                                commentElement.querySelector(
                                    'div:last-child'
                                ).innerHTML = `<div class="d-flex flex-column">
                                                                                                <div class = "d-flex align-items-center">
                                                                                                    <div class= "mr-2" style= "font-weight: bold;">${sessionStorage.getItem(
                                                                                                        'username'
                                                                                                    )}</div>
                                                                                                    <div style="font-size:.8rem">${datePosted}</div>
                                                                                                </div>
                                                                                                <div style="font-weight: normal;">${
                                                                                                    commentArray[
                                                                                                        i
                                                                                                    ]
                                                                                                        .review
                                                                                                }</div>
                                                                                                <div class = "ratings d-flex">
                                                                                                    <i number="1" class = "bi bi-star"></i>
                                                                                                    <i number="2" class = "bi bi-star"></i>
                                                                                                    <i number="3" class = "bi bi-star"></i>
                                                                                                    <i number="4" class = "bi bi-star"></i>
                                                                                                    <i number="5" class = "bi bi-star"></i>
                                                                                                </div>
                                                                                                <div class = "likesOrDislikes d-flex">
                                                                                                    <div class = "like d-flex align-items-center mr-2 ownComment" style="cursor: context-menu;">
                                                                                                        <i index = ${i} class = "bi bi-hand-thumbs-up"></i>                                                                
                                                                                                        <p class = "numberLikes m-0" style = "font-size:.8rem;">${likes}</p>
                                                                                                    </div>
                                                                                                    <div class = "dislike d-flex align-items-center ownComment" style="cursor: context-menu;">
                                                                                                        <i index = ${i} class = "bi bi-hand-thumbs-down"></i>
                                                                                                        <p class = "numberDislikes m-0" style="font-size:.8rem;">${dislikes}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div style = "position: relative;display:flex;align-items:top;">
                                                                                                <button class = "editCommentBtn btn d-flex align-items-top" index = ${i} style = "cursor: context-menu !important">
                                                                                                    <i class="bi bi-three-dots-vertical" index = ${i} style = "cursor: pointer"></i>
                                                                                                </button>
                                                                                                <div class = "editCommentMenu rounded darkShadow" index = ${i}>
                                                                                                    <button class = "btn btn-secondary" index = ${i}><i class="bi bi-pencil"></i> Edit Comment</button>
                                                                                                    <button class = "btn btn-secondary" index = ${i}><i class="bi bi-trash"></i> Delete Comment</button>
                                                                                                </div>
                                                                                            </div>`;

                                document
                                    .querySelector(
                                        `.editCommentMenu[index="${i}"] button:last-child`
                                    )
                                    .addEventListener('click', (event) => {
                                        let deleteComment =
                                            new XMLHttpRequest();
                                        deleteComment.open(
                                            'DELETE',
                                            `/comments/${sessionStorage.getItem(
                                                'token'
                                            )}`,
                                            true
                                        );
                                        deleteComment.setRequestHeader(
                                            'Content-Type',
                                            'application/json'
                                        );
                                        deleteComment.onload = () => {
                                            let response = JSON.parse(
                                                deleteComment.responseText
                                            );
                                            if (response.affectedRows == 1) {
                                                displayComments();
                                            } else {
                                                $('#restaurantModal').modal(
                                                    'show'
                                                );
                                                document.querySelector(
                                                    '#restaurantModalTitle'
                                                ).innerHTML =
                                                    'Comment Deletion Failure';
                                                document.querySelector(
                                                    '#restaurantModal .modal-body'
                                                ).innerHTML = `We could not delete this comment.<br>Please try reloading this page and trying again.`;
                                            }
                                        };
                                        deleteComment.send(
                                            JSON.stringify({
                                                id: commentArray[
                                                    event.target.getAttribute(
                                                        'index'
                                                    )
                                                ]._id
                                            })
                                        );
                                    });
                                document
                                    .querySelector(
                                        `.editCommentMenu[index="${i}"] button`
                                    )
                                    .addEventListener('click', (event) => {
                                        let index =
                                            event.target.getAttribute('index');
                                        let comment = commentArray[index];
                                        let commentContainer =
                                            document.querySelector(
                                                `.ownComment[index="${index}"] div:last-child`
                                            );
                                        commentContainer.classList.remove(
                                            'justify-content-between'
                                        );
                                        commentContainer.innerHTML = `<form class = "col-12 p-0" onsubmit="return false;" index = ${index}>
                                                                        <input required autocomplete="off" id = "edit" type="text" class="form-control border-top-0 border-left-0 border-right-0 rounded-0 p-0" placeholder = "Update Comment" maxlength="100">
                                                                        <div class="col-12 d-flex justify-content-between mt-2 p-0">
                                                                            <div class = "ratings" index = ${index} style="cursor: pointer;">
                                                                                <i number = "1" class="bi bi-star" onclick = "showRating(event)"></i>
                                                                                <i number = "2" class="bi bi-star" onclick = "showRating(event)"></i>
                                                                                <i number = "3" class="bi bi-star" onclick = "showRating(event)"></i>
                                                                                <i number = "4" class="bi bi-star" onclick = "showRating(event)"></i>
                                                                                <i number = "5" class="bi bi-star" onclick = "showRating(event)"></i>
                                                                            </div>
                                                                            <div class="buttonGroup">
                                                                                <button type = "button" class="btn btn-outline-danger mr-2">Cancel</button>
                                                                                <button type = "submit" class="btn btn-secondary" disabled>Update Comment</button>
                                                                            </div>
                                                                        </div>
                                                                    </form>`;
                                        commentContainer.querySelector(
                                            '#edit'
                                        ).value = comment.review;
                                        commentContainer
                                            .querySelectorAll(
                                                '.col-12 .ratings>i[number]'
                                            )
                                            .forEach((star) => {
                                                if (
                                                    star.getAttribute(
                                                        'number'
                                                    ) <= comment.rating
                                                ) {
                                                    star.classList.remove(
                                                        'bi-star'
                                                    );
                                                    star.classList.add(
                                                        'bi-star-fill'
                                                    );
                                                }
                                            });
                                        commentContainer
                                            .querySelector(
                                                '.col-12 .buttonGroup button:first-child'
                                            )
                                            .addEventListener('click', () => {
                                                displayComments();
                                            });
                                        commentContainer
                                            .querySelector('input')
                                            .focus();
                                        commentContainer
                                            .querySelector('form input')
                                            .addEventListener(
                                                'input',
                                                (event) => {
                                                    let form =
                                                        event.target
                                                            .parentElement;
                                                    let inputVal =
                                                        form.querySelector(
                                                            'input'
                                                        ).value;
                                                    let rating = 0;
                                                    form.querySelectorAll(
                                                        '.col-12 .ratings i[number]'
                                                    ).forEach((star) => {
                                                        if (
                                                            star.classList.contains(
                                                                'bi-star-fill'
                                                            )
                                                        )
                                                            rating++;
                                                    });
                                                    if (
                                                        (inputVal !=
                                                            comment.review ||
                                                            rating !=
                                                                comment.rating) &&
                                                        inputVal != ''
                                                    ) {
                                                        commentContainer.querySelector(
                                                            '.col-12 .buttonGroup button:last-child'
                                                        ).disabled = false;
                                                    } else {
                                                        commentContainer.querySelector(
                                                            '.col-12 .buttonGroup button:last-child'
                                                        ).disabled = true;
                                                    }
                                                }
                                            );
                                        commentContainer
                                            .querySelector(
                                                '.col-12 .buttonGroup button:last-child'
                                            )
                                            .addEventListener(
                                                'click',
                                                (event) => {
                                                    let form =
                                                        event.target
                                                            .parentElement
                                                            .parentElement
                                                            .parentElement;
                                                    let review =
                                                        form.querySelector(
                                                            'input'
                                                        ).value;
                                                    let id =
                                                        commentArray[
                                                            form.getAttribute(
                                                                'index'
                                                            )
                                                        ]._id;
                                                    let rating = 0;
                                                    form.querySelectorAll(
                                                        '.col-12 .ratings i[number]'
                                                    ).forEach((star) => {
                                                        if (
                                                            star.classList.contains(
                                                                'bi-star-fill'
                                                            )
                                                        )
                                                            rating =
                                                                star.getAttribute(
                                                                    'number'
                                                                );
                                                    });
                                                    let updateComment =
                                                        new XMLHttpRequest();
                                                    updateComment.open(
                                                        'PUT',
                                                        `/comments/${sessionStorage.getItem(
                                                            'token'
                                                        )}`,
                                                        true
                                                    );
                                                    updateComment.setRequestHeader(
                                                        'Content-Type',
                                                        'application/json'
                                                    );
                                                    updateComment.onload =
                                                        () => {
                                                            let response =
                                                                JSON.parse(
                                                                    updateComment.responseText
                                                                );
                                                            if (
                                                                response.affectedRows ==
                                                                1
                                                            ) {
                                                                displayComments();
                                                            } else {
                                                                $(
                                                                    '#restaurantModal'
                                                                ).modal('show');
                                                                document.querySelector(
                                                                    '#restaurantModalTitle'
                                                                ).innerHTML =
                                                                    'Comment Update Failure';
                                                                document.querySelector(
                                                                    '#restaurantModal .modal-body'
                                                                ).innerHTML = `We could not update this comment.<br>Please try reloading this page and trying again.`;
                                                            }
                                                        };
                                                    updateComment.send(
                                                        JSON.stringify({
                                                            id: id,
                                                            restaurantId:
                                                                Global.currentRestaurantIndex,
                                                            restaurant:
                                                                Global
                                                                    .restaurantArray[
                                                                    Global
                                                                        .currentRestaurantIndex
                                                                ].name,
                                                            review: review,
                                                            rating: rating
                                                        })
                                                    );
                                                }
                                            );
                                    });
                            }
                        }
                        let commentElements =
                            document.querySelectorAll('[index]');
                        commentElements.forEach((commentElement) => {
                            let index = commentElement.getAttribute('index');
                            let rating = commentArray[index].rating;
                            let ratingElements =
                                commentElement.querySelectorAll(
                                    '.ratings i[number]'
                                );
                            ratingElements.forEach((star) => {
                                if (star.getAttribute('number') <= rating) {
                                    star.classList.remove('bi-star');
                                    star.classList.add('bi-star-fill');
                                }
                            });
                        });
                        let likeElements = document.querySelectorAll(
                            '#comments>div.row:not(.ownComment) .likesOrDislikes>div'
                        );
                        likeElements.forEach((likeElement) => {
                            $(likeElement).on('click', (event) => {
                                let element = event.target;
                                let index = element.parentElement
                                    .querySelector('i')
                                    .getAttribute('index');
                                let comment = commentArray[index];
                                let [isLiked, isDisliked] = Array(2).fill(0);
                                if (
                                    element.parentElement.classList.contains(
                                        'like'
                                    )
                                ) {
                                    isLiked = 1;
                                } else if (
                                    element.parentElement.classList.contains(
                                        'dislike'
                                    )
                                ) {
                                    isDisliked = 1;
                                }
                                let getLikesDislikes = new XMLHttpRequest();
                                getLikesDislikes.open(
                                    'GET',
                                    '/likeOrDislike',
                                    true
                                );
                                getLikesDislikes.send();
                                getLikesDislikes.onload = () => {
                                    let allLikesDislikes = JSON.parse(
                                        getLikesDislikes.responseText
                                    );
                                    let count = 0;
                                    allLikesDislikes.forEach((like) => {
                                        if (
                                            like.commentId == comment._id &&
                                            like.isLiked == isLiked &&
                                            like.isDisliked == isDisliked &&
                                            like.username ==
                                                sessionStorage.getItem(
                                                    'username'
                                                )
                                        ) {
                                            let deleteLikeOrDislike =
                                                new XMLHttpRequest();
                                            deleteLikeOrDislike.open(
                                                'DELETE',
                                                '/likeOrDislike/' +
                                                    sessionStorage.getItem(
                                                        'token'
                                                    ),
                                                true
                                            );
                                            deleteLikeOrDislike.setRequestHeader(
                                                'Content-Type',
                                                'application/json'
                                            );
                                            deleteLikeOrDislike.onload = () => {
                                                let results = JSON.parse(
                                                    deleteLikeOrDislike.responseText
                                                );
                                                if (results.affectedRows == 1) {
                                                    let upOrDown =
                                                        isLiked == 1
                                                            ? 'up'
                                                            : 'down';
                                                    element.parentElement
                                                        .querySelector('i')
                                                        .classList.remove(
                                                            `bi-hand-thumbs-${upOrDown}-fill`
                                                        );
                                                    element.parentElement
                                                        .querySelector('i')
                                                        .classList.add(
                                                            `bi-hand-thumbs-${upOrDown}`
                                                        );
                                                    element.parentElement.querySelector(
                                                        'p'
                                                    ).innerHTML =
                                                        parseInt(
                                                            element.parentElement.querySelector(
                                                                'p'
                                                            ).innerHTML
                                                        ) - 1;
                                                } else {
                                                    $('#restaurantModal').modal(
                                                        'show'
                                                    );
                                                    document.querySelector(
                                                        '#restaurantModalTitle'
                                                    ).innerHTML = `Comment ${
                                                        isLiked == 1
                                                            ? 'like'
                                                            : 'dislike'
                                                    } Failure`;
                                                    document.querySelector(
                                                        '#restaurantModal .modal-body'
                                                    ).innerHTML = `We could not ${
                                                        isLiked == 1
                                                            ? 'like'
                                                            : 'dislike'
                                                    } this comment.<br>Please try reloading this page and trying again.`;
                                                }
                                            };
                                            deleteLikeOrDislike.send(
                                                JSON.stringify({ id: like._id })
                                            );
                                        } else if (
                                            like.commentId == comment._id &&
                                            like.username ==
                                                sessionStorage.getItem(
                                                    'username'
                                                )
                                        ) {
                                            let createLikeOrDislike =
                                                new XMLHttpRequest();
                                            createLikeOrDislike.open(
                                                'POST',
                                                '/likeOrDislike/' +
                                                    sessionStorage.getItem(
                                                        'token'
                                                    ),
                                                true
                                            );
                                            createLikeOrDislike.setRequestHeader(
                                                'Content-Type',
                                                'application/json'
                                            );
                                            createLikeOrDislike.onload = () => {
                                                let results = JSON.parse(
                                                    createLikeOrDislike.responseText
                                                );
                                                if (results.affectedRows == 1) {
                                                    let deleteLikeOrDislike =
                                                        new XMLHttpRequest();
                                                    deleteLikeOrDislike.open(
                                                        'DELETE',
                                                        '/likeOrDislike/' +
                                                            sessionStorage.getItem(
                                                                'token'
                                                            ),
                                                        true
                                                    );
                                                    deleteLikeOrDislike.setRequestHeader(
                                                        'Content-Type',
                                                        'application/json'
                                                    );
                                                    deleteLikeOrDislike.onload =
                                                        () => {
                                                            let results =
                                                                JSON.parse(
                                                                    deleteLikeOrDislike.responseText
                                                                );
                                                            if (
                                                                results.affectedRows ==
                                                                1
                                                            ) {
                                                                let upOrDown =
                                                                    isLiked == 1
                                                                        ? 'up'
                                                                        : 'down';
                                                                let likeOrDislikeClass =
                                                                    isLiked == 1
                                                                        ? 'dislike'
                                                                        : 'like';
                                                                let opposite =
                                                                    upOrDown ==
                                                                    'up'
                                                                        ? 'down'
                                                                        : 'up';
                                                                element.parentElement
                                                                    .querySelector(
                                                                        'i'
                                                                    )
                                                                    .classList.add(
                                                                        `bi-hand-thumbs-${upOrDown}-fill`,
                                                                        'selected'
                                                                    );
                                                                element.parentElement
                                                                    .querySelector(
                                                                        'i'
                                                                    )
                                                                    .classList.remove(
                                                                        `bi-hand-thumbs-${upOrDown}`
                                                                    );
                                                                element.parentElement
                                                                    .querySelector(
                                                                        'i'
                                                                    )
                                                                    .addEventListener(
                                                                        'animationend',
                                                                        (
                                                                            event
                                                                        ) => {
                                                                            event.target.classList.remove(
                                                                                'selected'
                                                                            );
                                                                        }
                                                                    );
                                                                element.parentElement.querySelector(
                                                                    'p'
                                                                ).innerHTML =
                                                                    parseInt(
                                                                        element.parentElement.querySelector(
                                                                            'p'
                                                                        )
                                                                            .innerHTML
                                                                    ) + 1;

                                                                element.parentElement.parentElement
                                                                    .querySelector(
                                                                        `.${likeOrDislikeClass} i`
                                                                    )
                                                                    .classList.remove(
                                                                        `bi-hand-thumbs-${opposite}-fill`
                                                                    );
                                                                element.parentElement.parentElement
                                                                    .querySelector(
                                                                        `.${likeOrDislikeClass} i`
                                                                    )
                                                                    .classList.add(
                                                                        `bi-hand-thumbs-${opposite}`
                                                                    );
                                                                element.parentElement.parentElement.querySelector(
                                                                    `.${likeOrDislikeClass} p`
                                                                ).innerHTML =
                                                                    parseInt(
                                                                        element.parentElement.parentElement.querySelector(
                                                                            `.${likeOrDislikeClass} p`
                                                                        )
                                                                            .innerHTML
                                                                    ) - 1;
                                                            } else {
                                                                $(
                                                                    '#restaurantModal'
                                                                ).modal('show');
                                                                document.querySelector(
                                                                    '#restaurantModalTitle'
                                                                ).innerHTML = `Comment ${
                                                                    isLiked == 1
                                                                        ? 'like'
                                                                        : 'dislike'
                                                                } Failure`;
                                                                document.querySelector(
                                                                    '#restaurantModal .modal-body'
                                                                ).innerHTML = `We could not ${
                                                                    isLiked == 1
                                                                        ? 'like'
                                                                        : 'dislike'
                                                                } this comment.<br>Please try reloading this page and trying again.`;
                                                            }
                                                        };
                                                    deleteLikeOrDislike.send(
                                                        JSON.stringify({
                                                            id: like._id
                                                        })
                                                    );
                                                } else {
                                                    $('#restaurantModal').modal(
                                                        'show'
                                                    );
                                                    document.querySelector(
                                                        '#restaurantModalTitle'
                                                    ).innerHTML = `Comment ${
                                                        isLiked == 1
                                                            ? 'like'
                                                            : 'dislike'
                                                    } Failure`;
                                                    document.querySelector(
                                                        '#restaurantModal .modal-body'
                                                    ).innerHTML = `We could not ${
                                                        isLiked == 1
                                                            ? 'like'
                                                            : 'dislike'
                                                    } this comment.<br>Please try reloading this page and trying again.`;
                                                }
                                            };
                                            createLikeOrDislike.send(
                                                JSON.stringify({
                                                    commentId: comment._id,
                                                    isLiked: isLiked,
                                                    isDisliked: isDisliked
                                                })
                                            );
                                        } else {
                                            count++;
                                        }
                                    });
                                    if (count == allLikesDislikes.length) {
                                        let createLikeOrDislike =
                                            new XMLHttpRequest();
                                        createLikeOrDislike.open(
                                            'POST',
                                            '/likeOrDislike/' +
                                                sessionStorage.getItem('token'),
                                            true
                                        );
                                        createLikeOrDislike.setRequestHeader(
                                            'Content-Type',
                                            'application/json'
                                        );
                                        createLikeOrDislike.onload = () => {
                                            let results = JSON.parse(
                                                createLikeOrDislike.responseText
                                            );
                                            if (results.affectedRows == 1) {
                                                let upOrDown =
                                                    isLiked == 1
                                                        ? 'up'
                                                        : 'down';
                                                element.parentElement
                                                    .querySelector('i')
                                                    .classList.add(
                                                        `bi-hand-thumbs-${upOrDown}-fill`,
                                                        'selected'
                                                    );
                                                element.parentElement
                                                    .querySelector('i')
                                                    .classList.remove(
                                                        `bi-hand-thumbs-${upOrDown}`
                                                    );
                                                element.parentElement
                                                    .querySelector('i')
                                                    .addEventListener(
                                                        'animationend',
                                                        (event) => {
                                                            event.target.classList.remove(
                                                                'selected'
                                                            );
                                                        }
                                                    );
                                                element.parentElement.querySelector(
                                                    'p'
                                                ).innerHTML =
                                                    parseInt(
                                                        element.parentElement.querySelector(
                                                            'p'
                                                        ).innerHTML
                                                    ) + 1;
                                            } else {
                                                $('#restaurantModal').modal(
                                                    'show'
                                                );
                                                document.querySelector(
                                                    '#restaurantModalTitle'
                                                ).innerHTML = `Comment ${
                                                    isLiked == 1
                                                        ? 'like'
                                                        : 'dislike'
                                                } Failure`;
                                                document.querySelector(
                                                    '#restaurantModal .modal-body'
                                                ).innerHTML = `We could not ${
                                                    isLiked == 1
                                                        ? 'like'
                                                        : 'dislike'
                                                } this comment.<br>Please try reloading this page and trying again.`;
                                            }
                                        };
                                        createLikeOrDislike.send(
                                            JSON.stringify({
                                                commentId: comment._id,
                                                isLiked: isLiked,
                                                isDisliked: isDisliked
                                            })
                                        );
                                    }
                                };
                            });
                        });
                        let ownLikeElements = document.querySelectorAll(
                            '#comments>.ownComment .likesOrDislikes>div'
                        );
                        ownLikeElements.forEach((ownLike) => {
                            ownLike.style =
                                'cursor: pointer; position: relative;';
                            let height = document.querySelector(
                                '#comments .row[index]'
                            ).offsetHeight;
                            let isDisliked = ownLike.classList.contains('like')
                                ? 0
                                : 1;
                            ownLike.innerHTML += `<div class = "rounded likeList darkShadow noscroll" style = "width: max-content" index = "${ownLike
                                .querySelector('i')
                                .getAttribute('index')}"></div>`;
                            JSON.parse(getLikesOrDislikes.responseText).forEach(
                                (like) => {
                                    if (
                                        like.commentId ==
                                            commentArray[
                                                ownLike
                                                    .querySelector('i')
                                                    .getAttribute('index')
                                            ]._id &&
                                        isDisliked == like.isDisliked
                                    ) {
                                        let username = like.username;
                                        userList.forEach((user) => {
                                            if (username == user.username) {
                                                let imagePath = user.imagePath
                                                    ? `/upload/${user.imagePath}`
                                                    : 'images/default-user.png';
                                                ownLike.querySelector(
                                                    '.likeList'
                                                ).innerHTML += `<div class = "d-flex align-items-center my-2">
                                                                                                <img src = "${imagePath}" style = "border-radius: 50%; width: 30px; height: 30px;">
                                                                                                <b class = "ml-2">${user.username}</b>
                                                                                            </div>`;
                                            }
                                        });
                                    }
                                }
                            );
                            if (
                                ownLike.querySelector('.likeList').innerHTML ==
                                ''
                            ) {
                                ownLike.querySelector(
                                    '.likeList'
                                ).innerHTML = `<div> No one ${
                                    isDisliked == 0 ? 'liked' : 'disliked'
                                } this comment</div>`;
                            }
                            if (
                                ownLike.querySelectorAll('.likeList div')
                                    .length > 1
                            ) {
                                ownLike.querySelector(
                                    '.likeList'
                                ).style.height = `${height}px`;
                                let list = ownLike.querySelector(
                                    `.likeList[index="${ownLike
                                        .querySelector('i')
                                        .getAttribute('index')}"]`
                                );
                                list.classList.remove('noscroll');
                            }
                        });
                    };
                    getUserList.send();
                }
            } else {
                document.querySelector(
                    '#comments'
                ).innerHTML = `<div class = "d-flex justify-content-center">
                                                                    <h4>No Reviews for this restaurant.</h4>
                                                                    <h6>Try creating a review for this restaurant!</h6>
                                                                </div>`;
            }
        };
        getLikesOrDislikes.send();
    };
    getComments.send();
}

document.addEventListener('click', (event) => {
    document
        .querySelectorAll('.editCommentMenu button, .likeList')
        .forEach((element) => {
            if (element == event.target) return;
        });
    let active;
    if (event.target.classList.contains('bi-three-dots-vertical')) {
        active = document.querySelector(
            `.editCommentMenu[index="${event.target.getAttribute('index')}"]`
        );
        active.classList.toggle('active');
    }
    document.querySelectorAll(`.editCommentMenu`).forEach((menu) => {
        if (menu == active) return;
        menu.classList.remove('active');
    });

    try {
        let currentList;
        if (
            (event.target.parentElement.classList.contains('like') ||
                event.target.parentElement.classList.contains('dislike')) &&
            event.target.parentElement.classList.contains('ownComment')
        ) {
            currentList = event.target.parentElement.querySelector(
                `.likeList[index="${event.target.parentElement
                    .querySelector('i')
                    .getAttribute('index')}"]`
            );
            currentList.classList.toggle('active');
        }
        document.querySelectorAll('.likeList').forEach((btn) => {
            if (btn == currentList) return;
            btn.classList.remove('active');
        });
    } catch (error) {}
});

function logout() {
    $('#restaurantModal').unbind('shown.bs.modal');
    $('#restaurantModal').unbind('hidden.bs.modal');
    $('#restaurantModal').modal('show');
    document.querySelector('#restaurantModalTitle').innerHTML =
        sessionStorage.getItem('username') + "'s Log out";
    document.querySelector('#restaurantModal .modal-body').innerHTML =
        'Successfully logged out of the account <b>' +
        sessionStorage.getItem('username') +
        '</b>.<br>';
    $('#restaurantModal').on('hidden.bs.modal', () => {
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
