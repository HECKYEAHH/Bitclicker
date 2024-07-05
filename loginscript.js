document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('user-login-form');
    const signupForm = document.getElementById('user-signup-form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        const users = await fetch('users.json').then(response => response.json());
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem('username', username);
            window.location.href = 'idle.html'; // Redirect to the BitClicker game page
        } else {
            alert('Invalid username or password.');
        }
    });

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        
        const users = await fetch('users.json').then(response => response.json());
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Username already exists. Please choose a different username.');
        } else {
            const newUser = { username, password };
            users.push(newUser);

            // Update the users.json file on GitHub
            await fetch('https://api.github.com/repos/your-username/your-repo/contents/users.json', {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${localStorage.getItem('GH_TOKEN')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Add new user',
                    content: btoa(JSON.stringify(users)),
                    sha: await fetch('https://api.github.com/repos/your-username/your-repo/contents/users.json').then(res => res.json()).then(data => data.sha)
                })
            });

            alert('Account created successfully. You can now log in.');
        }
    });
});
