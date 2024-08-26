document.addEventListener('DOMContentLoaded', () => {
    const initialView = document.getElementById('initial-view');
    const loginForms = document.getElementById('login-forms');
    const appDiv = document.getElementById('app');

    // Show login forms
    document.getElementById('show-admin-login').addEventListener('click', () => {
        initialView.style.display = 'none';
        loginForms.style.display = 'block';
        document.getElementById('user-login-form').style.display = 'none';
        document.getElementById('admin-login-form').style.display = 'block';
    });

    document.getElementById('show-user-login').addEventListener('click', () => {
        initialView.style.display = 'none';
        loginForms.style.display = 'block';
        document.getElementById('admin-login-form').style.display = 'none';
        document.getElementById('user-login-form').style.display = 'block';
    });

    // Admin Login Form
    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const clubName = document.getElementById('admin-club-name').value;
        const password = document.getElementById('admin-password').value;
        
        fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clubName, password })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Admin authenticated successfully') {
                loginForms.style.display = 'none';
                appDiv.style.display = 'block';
                showAdminControls(clubName);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // User Login Form
    document.getElementById('user-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const enrollmentNumber = document.getElementById('enrollment-number').value;
        
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enrollmentNumber })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'User authenticated successfully') {
                loginForms.style.display = 'none';
                appDiv.style.display = 'block';
                showClubsForUser(data.clubName);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function showAdminControls(clubName) {
        // Show admin controls and allow them to add notifications
        appDiv.innerHTML = `
            <h2>Admin Controls for ${clubName}</h2>
            <form id="add-notification-form">
                <label for="notification">Add Notification:</label>
                <input type="text" id="notification" required>
                <button type="submit">Add Notification</button>
            </form>
            <div id="notifications"></div>
        `;
        
        document.getElementById('add-notification-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const notification = document.getElementById('notification').value;

            fetch(`/api/clubs/${clubName}/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notification })
            })
            .then(response => response.json())
            .then(notifications => {
                alert('Notification added');
                displayNotifications(notifications);
            })
            .catch(error => console.error('Error:', error));
        });
        
        fetch(`/api/clubs/${clubName}/notifications`)
            .then(response => response.json())
            .then(notifications => {
                displayNotifications(notifications);
            });
    }

    function showClubsForUser(clubName) {
        fetch('/api/clubs')
            .then(response => response.json())
            .then(clubs => {
                const appDiv = document.getElementById('app');
                appDiv.innerHTML = `<h2>Clubs for ${clubName}</h2>`;
                clubs.forEach(club => {
                    const clubDiv = document.createElement('div');
                    clubDiv.innerHTML = `
                        <h3>${club.clubName}</h3>
                        <button onclick="viewNotifications('${club.clubName}')">View Notifications</button>
                    `;
                    appDiv.appendChild(clubDiv);
                });
            });
    }

    function displayNotifications(notifications) {
        const notificationsDiv = document.getElementById('notifications');
        notificationsDiv.innerHTML = `<h3>Notifications</h3>`;
        notifications.forEach(notification => {
            const p = document.createElement('p');
            p.textContent = notification;
            notificationsDiv.appendChild(p);
        });
    }
});
