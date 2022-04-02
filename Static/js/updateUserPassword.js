if (!sessionStorage.getItem('token')) {
    window.location.href = '/';
}
document.getElementById('profilePhoto').src =
    sessionStorage.getItem('profilePhoto');
$('#profilePhoto').on('load', () => {
    document.getElementById('profilePhoto').style = 'opacity: 1;';
});

function send() {
    const event = new Event('submission');
    $('#form').unbind('shown.bs.modal');
    $('#updateUserPasswordModal').unbind('hidden.bs.modal');
    let old = document.getElementById('oldPassword').value;
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let token = sessionStorage.getItem('token');
    if (old == '' || newPassword == '' || confirmPassword == '') {
        return;
    }
    let loginUsingToken = new XMLHttpRequest();
    loginUsingToken.open('POST', '/users/login', true);
    loginUsingToken.setRequestHeader('Content-Type', 'application/json');
    loginUsingToken.onload = () => {
        let results = JSON.parse(loginUsingToken.responseText);
        if (results.result == 'Invalid Password') {
            document.getElementById('form').dispatchEvent(event);
            $('#updateUserPasswordModal').on('shown.bs.modal', () => {
                document.querySelector(
                    '#updateUserPasswordModalTitle'
                ).innerHTML = 'Password Update Failure';
                document.querySelector(
                    '#updateUserPasswordModal .modal-body'
                ).innerHTML =
                    'Invalid old password given.<br>Failed in updating the account.<br>';
            });
        } else {
            if (old != newPassword) {
                if (newPassword == confirmPassword) {
                    let updatePassword = new XMLHttpRequest();
                    updatePassword.open(
                        'POST',
                        `/users/updateUsers/${token}`,
                        true
                    );
                    updatePassword.setRequestHeader(
                        'Content-Type',
                        'application/json'
                    );
                    updatePassword.onload = () => {
                        document.getElementById('form').dispatchEvent(event);
                        $('#updateUserPasswordModal').on(
                            'shown.bs.modal',
                            () => {
                                document.querySelector(
                                    '#updateUserPasswordModalTitle'
                                ).innerHTML = 'Password Update Success';
                                document.querySelector(
                                    '#updateUserPasswordModal .modal-body'
                                ).innerHTML =
                                    'Succeeded in updating the password.<br>';
                            }
                        );
                        $('#updateUserPasswordModal').on(
                            'hidden.bs.modal',
                            () => {
                                document.getElementById('oldPassword').value =
                                    '';
                                document.getElementById('newPassword').value =
                                    '';
                                document.getElementById(
                                    'confirmPassword'
                                ).value = '';
                                sessionStorage.removeItem('token');
                                window.location.href = '/';
                            }
                        );
                    };
                    updatePassword.send(
                        JSON.stringify({ password: newPassword })
                    );
                } else {
                    document.getElementById('form').dispatchEvent(event);
                    $('#updateUserPasswordModal').on('shown.bs.modal', () => {
                        document.querySelector(
                            '#updateUserPasswordModalTitle'
                        ).innerHTML = 'Password Update Failure';
                        document.querySelector(
                            '#updateUserPasswordModal .modal-body'
                        ).innerHTML =
                            'Invalid Confirm Password. <br> Please ensure that the new password and confirm password are equal together.';
                    });
                }
            } else {
                document.getElementById('form').dispatchEvent(event);
                $('#updateUserPasswordModal').on('shown.bs.modal', () => {
                    document.querySelector(
                        '#updateUserPasswordModalTitle'
                    ).innerHTML = 'Password Update Failure';
                    document.querySelector(
                        '#updateUserPasswordModal .modal-body'
                    ).innerHTML = 'Choose a different password to change into.';
                });
            }
        }
    };
    loginUsingToken.send(JSON.stringify({ token: token, password: old }));
}

$('#form').on('submission', () => {
    $('#updateUserPasswordModal').modal('show');
});

function logout() {
    $('#updateUserPasswordModal').unbind('shown.bs.modal');
    $('#updateUserPasswordModal').modal('show');
    document.querySelector('#updateUserPasswordModalTitle').innerHTML =
        sessionStorage.getItem('username') + "'s Log out";
    document.querySelector('#updateUserPasswordModal .modal-body').innerHTML =
        'Successfully logged out of the account <b>' +
        sessionStorage.getItem('username') +
        '</b>.<br>';
    $('#updateUserPasswordModal').on('hidden.bs.modal', () => {
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
