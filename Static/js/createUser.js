let passwordCheck = false;
function submitForm(event) {
    event.preventDefault();

    if (
        !(
            document.querySelector('#dummyUsername').value &&
            document.querySelector('#confirmPassword').value &&
            document.querySelector('#dummyPassword').value &&
            document.querySelector('#dummyEmail').value &&
            document.querySelector('#dummyAddress').value &&
            document.querySelector('#dummyPhoneNum').value &&
            document.querySelector('#dummyFirstName').value &&
            document.querySelector('#dummyLastName').value
        )
    ) {
        return;
    }

    document.querySelector('#username').value =
        document.querySelector('#dummyUsername').value;
    document.querySelector('#email').value =
        document.querySelector('#dummyEmail').value;
    document.querySelector('#phone').value =
        document.querySelector('#dummyPhoneNum').value;
    document.querySelector('#address').value =
        document.querySelector('#dummyAddress').value;
    document.querySelector('#firstName').value =
        document.querySelector('#dummyFirstName').value;
    document.querySelector('#lastName').value =
        document.querySelector('#dummyLastName').value;

    let gender = document.querySelector('#dummyForm').dummyGender.value;
    if (gender == 'M') {
        document.querySelector('#Male').checked = true;
    } else {
        document.querySelector('#Female').checked = true;
    }
    let confirm = document.querySelector('#confirmPassword').value;
    let password = document.querySelector('#dummyPassword').value;
    if (confirm == password) {
        document.querySelector('#password').value = password;
        document.querySelector('#form').submit();
        passwordCheck = false;
    } else {
        passwordCheck = true;
        $('#createUserModal').modal('show');
        document.querySelector('iframe').dispatchEvent(new Event('load'));
    }
}
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
    $('#createUserModal').unbind('hidden.bs.modal');
    if (passwordCheck) {
        console.log('in');
        $('#createUserModal').modal('show');
        document.querySelector('#createUserModalTitle').innerHTML =
            'Invalid Confirm Password';
        document.querySelector('#createUserModal .modal-body').innerHTML =
            'Password and confirm password are not the same.<br>Please Ensure they are equal.';
        $('#createUserModal').on('hidden.bs.modal', () => {
            document.querySelector('#confirmPassword').value = '';
            document.querySelector('#dummyPassword').value = '';
        });
    } else {
        let dummyframe = document.querySelector('iframe');
        let pre = dummyframe.contentWindow.document.querySelector('pre');
        if (!pre) return;
        let result = JSON.parse(pre.innerText);

        if (result.code == 'ER_DUP_ENTRY') {
            $('#createUserModal').modal('show');
            let error = result.sqlMessage.slice(
                result.sqlMessage.search('key') + 4
            );
            document.querySelector('#createUserModalTitle').innerHTML =
                document.getElementById('username').value +
                "'s Creation Failure";
            document.querySelector('#createUserModal .modal-body').innerHTML =
                'Failed in creating the account <b>' +
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
            $('#createUserModal').modal('show');
            let username = document.getElementById('username').value;
            if (username.length > 30) {
                username = username.slice(0, 26) + '...';
            }
            let error = result.sqlMessage.slice(result.sqlMessage.search("'"));
            console.log(error);
            document.querySelector('#createUserModalTitle').innerHTML =
                username + "'s Creation Failure";
            document.querySelector('#createUserModal .modal-body').innerHTML =
                'Failed in creating the account <b>' + username + '</b>.<br>';
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
            $('#createUserModal').modal('show');
            document.querySelector('#createUserModal .modal-body').innerHTML =
                'Successfully created the account <b>' +
                document.getElementById('username').value +
                '</b>.';
            document.querySelector('#createUserModalTitle').innerHTML =
                document.getElementById('username').value + "'s Creation";
            $('#createUserModal').on('hidden.bs.modal', () => {
                document.getElementById('dummyUsername').value = '';
                document.getElementById('dummyPassword').value = '';
                document.getElementById('dummyEmail').value = '';
                document.getElementById('dummyPhoneNum').value = '';
                document.getElementById('dummyFirstName').value = '';
                document.getElementById('dummyLastName').value = '';
                document.getElementById('dummyMale').checked = true;
                document.getElementById('output').src =
                    'images/default-user.png';
                window.location.href = 'Login';
            });
        }
    }
});
