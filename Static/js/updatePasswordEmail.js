let pathname = window.location.pathname;
let email = pathname.slice(1, pathname.search('&'));
let token = pathname.slice(pathname.search('&') + 1);

let getTrueToken = new XMLHttpRequest();
getTrueToken.open('POST', '/users/forgotPassword', true);
getTrueToken.setRequestHeader('Content-Type', 'application/json');
getTrueToken.onload = () => {
    let results = JSON.parse(getTrueToken.responseText);
    if (
        results.result == 'Invalid Token' ||
        results.result == 'Invalid Email'
    ) {
        document.querySelector('title').innerText = 'Invalid Link';
        document.querySelector(
            '.row'
        ).innerHTML = `<h1 class = "col-12 text-center">Invalid Link</h1>`;
    } else {
        token = results.result;
        let username;
        let getProfile = new XMLHttpRequest();
        getProfile.open('GET', `/users/${token}`, true);
        getProfile.onload = () => {
            username = JSON.parse(getProfile.responseText)[0].username;
            document.querySelector(
                'title'
            ).innerHTML = `Change Password for ${username} - ClickToEat`;
            document.querySelector('#title b').innerHTML = username;
        };
        getProfile.send();
    }
};
getTrueToken.send(
    JSON.stringify({
        email: email,
        token: token,
        fromEmail: 'true'
    })
);

function send() {
    const event = new Event('submission');
    $('#form').unbind('shown.bs.modal');
    $('#updateUserPasswordModal').unbind('hidden.bs.modal');
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    if (!(newPassword && confirmPassword)) return;
    if (newPassword == confirmPassword) {
        let updatePassword = new XMLHttpRequest();
        updatePassword.open('POST', `/users/updateUsers/${token}`, true);
        updatePassword.setRequestHeader('Content-Type', 'application/json');
        updatePassword.onload = () => {
            document.getElementById('form').dispatchEvent(event);
            $('#updateUserPasswordModal').on('shown.bs.modal', () => {
                document.querySelector(
                    '#updateUserPasswordModalTitle'
                ).innerHTML = 'Password Update Success';
                document.querySelector(
                    '#updateUserPasswordModal .modal-body'
                ).innerHTML = 'Succeeded in updating the password.<br>';
            });
            $('#updateUserPasswordModal').on('hidden.bs.modal', () => {
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                window.location.replace('http://127.0.0.1:8080/public/Login');
            });
        };
        updatePassword.send(JSON.stringify({ password: newPassword }));
    } else {
        document.getElementById('form').dispatchEvent(event);
        $('#updateUserPasswordModal').on('shown.bs.modal', () => {
            document.querySelector('#updateUserPasswordModalTitle').innerHTML =
                'Password Update Failure';
            document.querySelector(
                '#updateUserPasswordModal .modal-body'
            ).innerHTML =
                'Invalid Confirm Password. <br> Please ensure that the new password and confirm password are equal together.';
        });
    }
}

$('#form').on('submission', () => {
    $('#updateUserPasswordModal').modal('show');
});
