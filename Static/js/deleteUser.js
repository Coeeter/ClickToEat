if (!sessionStorage.getItem('token')) {
    window.location.href = '/';
}

document.getElementById('profilePhoto').src =
    sessionStorage.getItem('profilePhoto');
$('#profilePhoto').on('load', () => {
    document.getElementById('profilePhoto').style = 'opacity: 1;';
});

function deleteAccount() {
    $('#deleteModal').unbind('shown.bs.modal');
    let password = document.querySelector('#password').value;
    if (!password) return;
    let logInUsingToken = new XMLHttpRequest();
    logInUsingToken.open('POST', '/users/login', true);
    logInUsingToken.setRequestHeader('Content-Type', 'application/json');
    logInUsingToken.onload = () => {
        let results = JSON.parse(logInUsingToken.responseText);
        if (results.result == 'Invalid Password') {
            $('#deleteModal').modal('show');
            $('#deleteModal').on('shown.bs.modal', () => {
                document.querySelector('#deleteModalTitle').innerHTML =
                    'Account Deletion Failure';
                document.querySelector('#deleteModal .modal-body').innerHTML =
                    'Invalid password given.<br>Failed in deleting the account ' +
                    sessionStorage.getItem('username') +
                    '.';
            });
        } else {
            let deleteAccount = new XMLHttpRequest();
            deleteAccount.open(
                'DELETE',
                `/users/${sessionStorage.getItem('token')}`,
                true
            );
            deleteAccount.onload = () => {
                $('#deleteModal').modal('show');
                $('#deleteModal').on('shown.bs.modal', () => {
                    document.querySelector('#deleteModalTitle').innerHTML =
                        'Account Deletion Success';
                    document.querySelector(
                        '#deleteModal .modal-body'
                    ).innerHTML =
                        'Succeeded in deleting the account <b>' +
                        sessionStorage.getItem('username') +
                        '<b>.';
                });
                $('#deleteModal').on('hidden.bs.modal', () => {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('username');
                    window.location.href = '/';
                });
            };
            deleteAccount.send();
        }
    };
    logInUsingToken.send(
        JSON.stringify({ token: sessionStorage.getItem('token'), password })
    );
}

function logout() {
    $('#deleteModal').unbind('shown.bs.modal');
    $('#deleteModal').modal('show');
    document.querySelector('#deleteModalTitle').innerHTML =
        sessionStorage.getItem('username') + "'s Log out";
    document.querySelector('#deleteModal .modal-body').innerHTML =
        'Successfully logged out of the account <b>' +
        sessionStorage.getItem('username') +
        '</b>.<br>';
    $('#deleteModal').on('hidden.bs.modal', () => {
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
