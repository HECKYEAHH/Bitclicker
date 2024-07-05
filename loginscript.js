document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('user-login-form');
    const signupForm = document.getElementById('user-signup-form');

    async function fetchUsers() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching user data. Please try again later.');
            return [];
        }
    }

    async function updateUserFile(users) {
        const token = prompt('Please enter your GitHub token to update user data:');
        if (!token) {
            alert('GitHub token is required to update user data.');
            return;
        }
        
        const content = btoa(JSON.stringify(users));
        try {
            const shaResponse = await fetch('https://api.github.com/repos/HECKYEAHH/Bitclicker/contents/users.json')
                .then(res => res.json());
            const sha = shaResponse.sha;

            const updateResponse = await fetch('https://api.github.com/repos/HECKYEAHH/Bitclicker/contents/users.json', {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Add new user',
                    content: content,
                    sha: sha
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update users.json');
            }
        } catch (error) {
            console.error('Error updating users:', error);
            alert('Error updating user data. Please try again later.');
        }
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const users = await fetchUsers();
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

        if (username === '' || password === '') {
            alert('Username and password cannot be empty.');
            return;
        }

        const users = await fetchUsers();
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Username already exists. Please choose a different username.');
        } else {
            const newUser = { username, password };
            users.push(newUser);

            // Update the users.json file on GitHub
            await updateUserFile(users);

            alert('Account created successfully. You can now log in.');
        }
    });
});
