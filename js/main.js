document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('api/login_process.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('error-msg').innerText = result.message;
            }
        });
    }

    const navbarMenu = document.getElementById('navbar-menu');
    if (navbarMenu) {
        const res = await fetch('api/check_session.php');
        const session = await res.json();

        if (!session.loggedIn) {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('welcome-msg').innerText = `Sveiki, ${session.username}!`;
        document.getElementById('user-role').innerText = session.role;

        let items = '';
        if (session.role === 'admin') {
            items = `
                <li><a href="dashboard.html" class="active">Sākums</a></li>
                <li><a href="add_product.html">Pievienot produktu</a></li>
                <li><a href="add_user.html">Pievienot lietotāju</a></li>
                <li><a href="users.html">Lietotāji</a></li>
                <li><a href="#" onclick="logout()">Iziet</a></li>
            `;
        } else if (session.role === 'warehouse_worker') {
            items = `
                <li><a href="dashboard.html" class="active">Sākums</a></li>
                <li><a href="orders.html">Veikt pasūtījumu</a></li>
                <li><a href="reports.html">Sagatavot atskaiti</a></li>
                <li><a href="#" onclick="logout()">Iziet</a></li>
            `;
        } else if (session.role === 'shelf_arranger') {
            items = `
                <li><a href="dashboard.html" class="active">Sākums</a></li>
                <li><a href="placement.html">Izvietot preces</a></li>
                <li><a href="reports.html">Sagatavot atskaiti</a></li>
                <li><a href="data_entry.html">Datu ievade</a></li>
                <li><a href="#" onclick="logout()">Iziet</a></li>
            `;
        }
        navbarMenu.innerHTML = items;
    }
});

async function logout() {
    await fetch('api/logout.php');
    window.location.href = 'index.html';
}