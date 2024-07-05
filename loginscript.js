document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('user-login-form');
    const signupForm = document.getElementById('user-signup-form');

    async function fetchUsers() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const users = await response.json();
            console.log('Fetched users:', users);
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching user data. Please try again later.');
            return [];
        }
    }

    async function updateUserFile(users) {
        let token = localStorage.getItem('GH_TOKEN');
        if (!token) {
            token = prompt('Please enter your GitHub token to update user data:');
            if (!token) {
                alert('GitHub token is required to update user data.');
                return;
            }
            localStorage.setItem('GH_TOKEN', token);
        }

        const content = btoa(JSON.stringify(users));
        try {
            const shaResponse = await fetch('https://api.github.com/repos/HECKYEAHH/Bitclicker/contents/users.json', {
                headers: {
                    'Authorization': `token ${token}`
                }
            }).then(res => res.json());

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

            alert('Account created successfully. You can now log in.');
        } catch (error) {
            console.error('Error updating users:', error);
            alert('Error updating user data. Please try again later.');
        }
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!username || !password) {
            alert('Username and password cannot be empty.');
            return;
        }

        const users = await fetchUsers();
        console.log('Users for login:', users);
        const user = users.find(user => user.username === username && user.password === password);
        console.log('Login user:', user);

        if (user) {
            localStorage.setItem('username', username);
            window.location.href = 'idle.html'; // Redirect to the BitClicker game page
        } else {
            alert('Invalid username or password.');
        }
    });

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!username || !password) {
            alert('Username and password cannot be empty.');
            return;
        }

        const users = await fetchUsers();
        console.log('Users for signup:', users);
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Username already exists. Please choose a different username.');
        } else {
            const newUser = { username, password };
            users.push(newUser);
            console.log('New user added:', newUser);
            console.log('Updated users list:', users);

            // Update the users.json file on GitHub
            await updateUserFile(users);
        }
    });
});
