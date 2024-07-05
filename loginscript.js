document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('user-login-form');
    const signupForm = document.getElementById('user-signup-form');

    async function fetchUsers() {
        try {
            const response = await fetch(`users.json?timestamp=${new Date().getTime()}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
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
                return false;
            }
            localStorage.setItem('GH_TOKEN', token);
        }
    
        const content = btoa(JSON.stringify(users));
        try {
            // Fetch the SHA of the existing users.json file
            const shaResponse = await fetch('https://api.github.com/repos/HECKYEAHH/Bitclicker/contents/users.json', {
                headers: {
                    'Authorization': `token ${token}`
                }
            });
    
            if (!shaResponse.ok) {
                throw new Error(`Failed to fetch SHA: ${shaResponse.status} ${shaResponse.statusText}`);
            }
    
            const shaData = await shaResponse.json();
            const sha = shaData.sha;
            console.log('SHA of users.json:', sha);
    
            // Update the users.json file with the new content
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
                const errorData = await updateResponse.json();
                throw new Error(`Failed to update users.json: ${updateResponse.status} ${updateResponse.statusText}. ${errorData.message}`);
            }
    
            const updateResult = await updateResponse.json();
            console.log('Update response:', updateResult);
            return true;
        } catch (error) {
            console.error('Error updating users:', error);
            alert(`Error updating user data: ${error.message}`);
            return false;
        }
    }
    
    

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
            console.log('Updated users list before update:', users);
    
            // Indicate to the user that the update is in progress
            alert('Creating account, please wait...');
    
            const updateResult = await updateUserFile(users);
    
            if (updateResult) {
                console.log('User successfully added:', newUser);
                const updatedUsers = await fetchUsers();
                console.log('Updated users list after update:', updatedUsers);
                const newUserCheck = updatedUsers.some(user => user.username === username && user.password === password);
                if (newUserCheck) {
                    alert('Account created and verified successfully. You can now log in.');
                    window.location.reload(); // Automatically reload the page
                } else {
                    alert('Account creation failed. Please try again.');
                }
            } else {
                alert('Failed to update user data. Please try again later.');
            }
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
            console.log('Updated users list before update:', users);
    
            // Indicate to the user that the update is in progress
            alert('Creating account, please wait...');
    
            const updateResult = await updateUserFile(users);
    
            if (updateResult) {
                console.log('User successfully added:', newUser);
                const updatedUsers = await fetchUsers();
                console.log('Updated users list after update:', updatedUsers);
                const newUserCheck = updatedUsers.some(user => user.username === username && user.password === password);
                if (newUserCheck) {
                    alert('Account created and verified successfully. You can now log in.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000); // Automatically reload the page after 3 seconds
                } else {
                    alert('Account creation failed. Please try again.');
                }
            } else {
                alert('Failed to update user data. Please try again later.');
            }
        }
    });
    
});
