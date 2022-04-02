if (!sessionStorage.getItem('token')) {
    window.location.href = '/';
}

document.querySelector(
    '#form'
).action = `/users/updateUsers/${sessionStorage.getItem('token')}`;

function getProfileDetails() {
    let profile;
    let getProfile = new XMLHttpRequest();
    getProfile.open('GET', `/users/${sessionStorage.getItem('token')}`, true);
    getProfile.onload = () => {
        profile = JSON.parse(getProfile.responseText)[0];
        document.getElementById('username').value = profile.username;
        document.getElementById('email').value = profile.email;
        document.getElementById('phone').value = profile.phoneNum;
        document.getElementById('address').value = profile.address;
        document.getElementById('firstName').value = profile.firstName;
        document.getElementById('lastName').value = profile.lastName;
        let gender = profile.gender;
        switch (gender) {
            case 'M':
                document.getElementById('Male').checked = true;
                break;
            case 'F':
                document.getElementById('Female').checked = true;
                break;
        }
        let profilePhoto = profile.imagePath
            ? `/upload/${profile.imagePath}`
            : 'images/default-user.png';
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
            document.getElementById('output').src = croppedImage.toDataURL();
        };
        cropper.src = profilePhoto;
        document.getElementById('profilePhoto').src = profilePhoto;
        $('#profilePhoto').on('load', () => {
            document.getElementById('profilePhoto').style = 'opacity: 1;';
        });
        sessionStorage.setItem('profilePhoto', profilePhoto);
        sessionStorage.setItem('username', profile.username);
    };
    getProfile.send();
}

getProfileDetails();

function loadFile(event) {
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
        document.getElementById('output').src = croppedImage.toDataURL();
    };
    cropper.src = URL.createObjectURL(event.target.files[0]);
}

document.querySelector('iframe').addEventListener('load', () => {
    $('#updateUserModal').unbind('hidden.bs.modal');
    let dummyframe = document.querySelector('iframe');
    let result = dummyframe.contentWindow.document.querySelector('pre');
    if (!result) return;
    result = JSON.parse(result.innerText);

    if (result.code == 'ER_DUP_ENTRY') {
        let error = result.sqlMessage.slice(
            result.sqlMessage.search('key') + 4
        );
        $('#updateUserModal').modal('show');
        document.querySelector('#updateUserModalTitle').innerHTML =
            document.getElementById('username').value + "'s Update Failure";
        document.querySelector('#updateUserModal .modal-body').innerHTML =
            'Failed in updating the account <b>' +
            document.getElementById('username').value +
            '</b>.<br>';
        let errorPoint;
        switch (error) {
            case "'user.username_UNIQUE'":
                errorPoint = 'Username';
                break;
            case "'user.email_UNIQUE'":
                errorPoint = 'Email';
                break;
            case "'user.phoneNum_UNIQUE'":
                errorPoint = 'Phone Number';
                break;
        }
        document.querySelector(
            '#createUserModal .modal-body'
        ).innerHTML += `${errorPoint} is already used by another user.<br> Please choose another ${errorPoint}.`;
    } else if (result.code == 'ER_DATA_TOO_LONG') {
        let error = result.sqlMessage.slice(result.sqlMessage.search("'"));
        $('#updateUserModal').modal('show');
        document.querySelector('#updateUserModalTitle').innerHTML =
            document.getElementById('username').value + "'s Update Failure";
        document.querySelector('#updateUserModal .modal-body').innerHTML =
            'Failed in updating the account <b>' +
            document.getElementById('username').value +
            '</b>.<br>';
        let errorPoint;
        switch (error) {
            case "'phoneNum' at row 1":
                errorPoint = 'Phone Number';
                break;
            case "'username' at row 1":
                errorPoint = 'Username';
                break;
            case "'email' at row 1":
                errorPoint = 'Email';
                break;
            case "'firstName' at row 1":
                errorPoint = 'First Name';
                break;
            case "'lastName' at row 1":
                errorPoint = 'Last Name';
                break;
        }
        document.querySelector(
            '#createUserModal .modal-body'
        ).innerHTML += `Invalid ${errorPoint}. ${errorPoint} is too long<br> Please choose another ${errorPoint}.`;
    } else {
        $('#updateUserModal').modal('show');
        document.querySelector('#updateUserModal .modal-body').innerHTML =
            'Successfully updated the account <b>' +
            document.getElementById('username').value +
            '</b>.';
        document.querySelector('#updateUserModalTitle').innerHTML =
            document.getElementById('username').value + "'s Update";
        sessionStorage.removeItem('token');
        sessionStorage.setItem('token', result.result);
        $('#updateUserModal').on('hidden.bs.modal', getProfileDetails);
    }
});

function logout() {
    $('#updateUserModal').unbind('shown.bs.modal');
    $('#updateUserModal').unbind('hidden.bs.modal');
    $('#updateUserModal').modal('show');
    document.querySelector('#updateUserModalTitle').innerHTML =
        sessionStorage.getItem('username') + "'s Log out";
    document.querySelector('#updateUserModal .modal-body').innerHTML =
        'Successfully logged out of the account <b>' +
        sessionStorage.getItem('username') +
        '</b>.<br>';
    $('#updateUserModal').on('hidden.bs.modal', () => {
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
        window.location.href = '/';
    });
}
