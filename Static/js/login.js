if (sessionStorage.getItem('token')) {
    window.location.href = 'Home';
}

document
    .querySelector('iframe[name="dummyframe"]')
    .addEventListener('load', getResults);

function getResults() {
    $('#loginModal').unbind('shown.bs.modal');
    let dummyframe = document.querySelector('iframe');
    let pre = dummyframe.contentWindow.document.querySelector('pre');
    if (pre) {
        let result = JSON.parse(pre.innerText);
        if (result.result == 'Invalid Username') {
            $('#loginModal').modal('show');
            $('#loginModal').on('shown.bs.modal', () => {
                document.querySelector('#loginModal .modal-body').innerHTML =
                    '<b>' +
                    document.getElementById('username').value +
                    '</b> does not exist. <br>';
                document.querySelector('#loginModal .modal-body').innerHTML +=
                    "Create the user account <a href = 'Register'>here</a>";
            });
        } else if (result.result == 'Invalid Password') {
            $('#loginModal').modal('show');
            $('#loginModal').on('shown.bs.modal', () => {
                document.querySelector('#loginModal .modal-body').innerHTML =
                    'Failed to log in as <b>' +
                    document.getElementById('username').value +
                    '</b>.<br>';
                document.querySelector('#loginModal .modal-body').innerHTML +=
                    "Password is incorrect.<br>If you cannot remember your password click <a href = 'ForgotPassword'>here</a>";
            });
        } else {
            // document.querySelector('#loginModalTitle').innerHTML = document.getElementById('username').value + "'s login";
            // document.querySelector("#loginModal .modal-body").innerHTML = "Successfully logged in as <b>" + document.getElementById('username').value + "</b>.<br>";
            let token = result.result;
            sessionStorage.setItem('token', token);
            document.querySelector('#username').value = '';
            document.querySelector('#password').value = '';
            window.location.href = 'Home';
        }
    }
}
