if (sessionStorage.getItem('token')) {
    window.location.href = 'Home';
}

function send() {
    if (document.querySelector('#email').value == '') {
        return;
    }
    $('#emailPassChange').unbind('hidden.bs.modal');
    document.querySelector('form button').disabled = true;
    let email = document.querySelector('#email').value;
    let sendEmail = new XMLHttpRequest();
    sendEmail.open('POST', '/users/forgotPassword', true);
    sendEmail.setRequestHeader('Content-Type', 'application/json');
    document.querySelectorAll('*').forEach((element) => {
        element.classList.add('loadingElements');
    });
    sendEmail.onload = () => {
        document.querySelectorAll('*').forEach((element) => {
            element.classList.remove('loadingElements');
        });
        let results = JSON.parse(sendEmail.responseText);
        if (results.accepted) {
            $('#emailPassChange').modal('show');
            document.querySelector('#emailPassChangeTitle').innerHTML =
                'Sending Password Reset Link Success';
            document.querySelector('#emailPassChange .modal-body').innerHTML =
                'Sent password reset link to account with email <b>' +
                document.getElementById('email').value +
                '</b>.<br> Go check your email to change your password.';
            $('#emailPassChange').on('hidden.bs.modal', () => {
                window.location.href = 'Login';
            });
        } else {
            $('#emailPassChange').modal('show');
            document.querySelector('#emailPassChangeTitle').innerHTML =
                'Sending Password Reset Link Failure';
            document.querySelector('#emailPassChange .modal-body').innerHTML =
                'Account with email <b>' +
                document.getElementById('email').value +
                '</b> does not exist. <br>';
            $('#emailPassChange').on('hidden.bs.modal', () => {
                document.querySelector('form button').disabled = false;
            });
        }
    };
    sendEmail.send(JSON.stringify({ email: email }));
}
