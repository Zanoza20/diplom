function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const passwordRepeat = document.getElementById('pass-repeat').value;

    if (password !== passwordRepeat) {
        document.getElementById('error-msg').style.display = 'block';
        return;
    }

}