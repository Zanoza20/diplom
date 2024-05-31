async function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const passwordRepeat = document.getElementById('pass-repeat').value;

    if (password !== passwordRepeat) {
        alert('Паролі не співпадають');
        return;
    }

    const user = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('actor.json');
        const data = await response.json();
        
        const userExists = data.some(u => u.email === email);
        
        if (userExists) {
            alert('Такий користувач вже є на сервері');
            return;
        }

        data.push(user);

        await fetch('actor.json', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        alert('Користувача успішно зареєстровано');
        window.location.href = 'https://diplom-beryl.vercel.app';
    } catch (error) {
        console.error('Error:', error);
    }
}