document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const librarySection = document.getElementById('librarySection');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorBox = document.getElementById('errorBox');
    const regErrorBox = document.getElementById('regErrorBox');
    const logoutBtn = document.getElementById('logoutBtn');
    const testUnauthorizedBtn = document.getElementById('testUnauthorizedBtn');
    const searchInput = document.getElementById('searchInput');
    const onlyAvailableCheck = document.getElementById('onlyAvailableCheck');
    const timerDisplay = document.getElementById('timerDisplay');

    const bookModal = document.getElementById('bookModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalReadAction = document.getElementById('modalReadAction');

    const DEFAULT_AGE_BY_ROLE = {
        school: 15,
        student: 19,
        teacher: 34
    };

    let selectedLoginRole = 'student';
    let selectedRegRole = 'student';
    let selectedSubject = 'Все';
    let allBooks = [];
    let activeModalBook = null;
    let timerInterval = null;

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }

    function showRegError(msg) {
        regErrorBox.textContent = msg;
        regErrorBox.classList.remove('hidden');
    }

    function hideRegError() {
        regErrorBox.classList.add('hidden');
    }

    function setLoginRole(role) {
        selectedLoginRole = role;
        document.querySelectorAll('#loginRoleSelector .role-chip').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.role === role);
        });
    }

    function setRegRole(role) {
        selectedRegRole = role;
        document.querySelectorAll('#regRoleSelector .role-chip').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.role === role);
        });
        document.getElementById('regAgeInput').value = DEFAULT_AGE_BY_ROLE[role] || 18;
    }

    // Переключение вкладок Вход / Регистрация
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        hideError();
        hideRegError();
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        hideError();
        hideRegError();
    });

    // Выбор роли при входе (не стирает введённый логин/пароль!)
    document.querySelectorAll('#loginRoleSelector .role-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            setLoginRole(btn.dataset.role);
            hideError();
        });
    });

    // Выбор роли при регистрации
    document.querySelectorAll('#regRoleSelector .role-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            setRegRole(btn.dataset.role);
            hideRegError();
        });
    });

    // Быстрая подстановка тестовых аккаунтов по клику на кнопку внизу
    document.querySelectorAll('.quick-fill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tabLogin.click();
            setLoginRole(btn.dataset.role);
            document.getElementById('loginInput').value = btn.dataset.login;
            document.getElementById('passwordInput').value = '12345';
            hideError();
        });
    });

    // Таймер сессии
    function startSessionTimer(seconds) {
        clearInterval(timerInterval);
        let remaining = seconds;

        function updateDisplay() {
            if (remaining <= 0) {
                clearInterval(timerInterval);
                showToast('Время сессии истекло! Выполните вход повторно.');
                switchToLogin();
                return;
            }
            const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
            const secs = String(remaining % 60).padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
            remaining--;
        }

        updateDisplay();
        timerInterval = setInterval(updateDisplay, 1000);
    }

    // Модальное окно книги
    function openBookModal(book) {
        activeModalBook = book;
        document.getElementById('modalCover').style.background = book.cover_color;
        document.getElementById('modalCategory').textContent = book.category;
        document.getElementById('modalSubject').textContent = book.subject;
        document.getElementById('modalRating').textContent = `★ ${book.rating}`;
        document.getElementById('modalTitle').textContent = book.title;
        document.getElementById('modalAuthor').textContent = book.author;
        document.getElementById('modalSummary').textContent = book.summary;
        document.getElementById('modalYear').textContent = `${book.year} г.`;
        document.getElementById('modalPages').textContent = `${book.pages} стр.`;
        document.getElementById('modalAgeRange').textContent =
            book.max_age >= 90 ? `${book.min_age}+ лет` : `${book.min_age}–${book.max_age} лет`;

        bookModal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => bookModal.classList.add('hidden'));
    bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) bookModal.classList.add('hidden');
    });

    modalReadAction.addEventListener('click', () => {
        if (activeModalBook) {
            showToast(`Открыта электронная версия: «${activeModalBook.title}»`);
            bookModal.classList.add('hidden');
        }
    });

    // Отрисовка фильтров по предметам
    function renderSubjectChips(books) {
        const container = document.getElementById('subjectChips');
        const subjects = ['Все', ...new Set(books.map(b => b.subject))];
        container.innerHTML = '';

        subjects.forEach(subj => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = `subject-chip ${subj === selectedSubject ? 'active' : ''}`;
            chip.textContent = subj;
            chip.addEventListener('click', () => {
                selectedSubject = subj;
                renderSubjectChips(allBooks);
                applyFilters();
            });
            container.appendChild(chip);
        });
    }

    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const onlyAvail = onlyAvailableCheck.checked;

        const filtered = allBooks.filter(b => {
            const matchesSubject = selectedSubject === 'Все' || b.subject === selectedSubject;
            const matchesAvail = !onlyAvail || b.available;
            const matchesQuery =
                !query ||
                b.title.toLowerCase().includes(query) ||
                b.author.toLowerCase().includes(query) ||
                b.subject.toLowerCase().includes(query);

            return matchesSubject && matchesAvail && matchesQuery;
        });

        renderBooks(filtered);
    }

    function switchToLibrary(data) {
        loginSection.classList.add('hidden');
        librarySection.classList.remove('hidden');

        const profile = data.profile;
        document.getElementById('profileName').textContent = profile.full_name;
        document.getElementById('profileRole').textContent = profile.role;
        document.getElementById('profileAge').textContent = `${profile.age} лет`;
        document.getElementById('profileCard').textContent = profile.card_number;
        document.getElementById('profileDept').textContent = profile.department;
        document.getElementById('profileLogin').textContent = profile.login;

        const initials = profile.full_name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0])
            .join('')
            .toUpperCase();
        document.getElementById('userAvatar').textContent = initials || 'ЛБ';

        allBooks = data.books;
        selectedSubject = 'Все';
        searchInput.value = '';
        onlyAvailableCheck.checked = false;

        document.getElementById('statAvailableCount').textContent = allBooks.length;
        document.getElementById('statInStockCount').textContent = allBooks.filter(b => b.available).length;
        document.getElementById('catalogTitle').textContent =
            `Каталог для вас (${allBooks.length} из ${data.total_catalog_count} книг)`;
        document.getElementById('catalogSubtitle').textContent =
            `Подобрано сервером для роли «${profile.role}» (${profile.age} лет)`;

        renderSubjectChips(allBooks);
        renderBooks(allBooks);
        startSessionTimer(data.remaining_seconds);
    }

    function switchToLogin() {
        clearInterval(timerInterval);
        bookModal.classList.add('hidden');
        librarySection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        hideError();
        hideRegError();
    }

    function renderBooks(books) {
        const grid = document.getElementById('booksGrid');
        grid.innerHTML = '';

        if (books.length === 0) {
            grid.innerHTML = '<p style="color:#64748b;">Учебники по выбранным фильтрам не найдены.</p>';
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="book-cover" style="background: ${book.cover_color}">
                    <div class="cover-top-row">
                        <span class="book-category">${book.category}</span>
                        <span class="book-rating">★ ${book.rating}</span>
                    </div>
                    <div class="cover-bottom-row">
                        <span>${book.pages} стр.</span>
                        <span>${book.year} г.</span>
                    </div>
                </div>
                <div class="book-body">
                    <div>
                        <div class="book-subject-label">${book.subject}</div>
                        <h4 class="book-title">${book.title}</h4>
                        <p class="book-author">${book.author}</p>
                        <p class="book-summary">${book.summary}</p>
                    </div>
                    <div class="book-footer">
                        <span class="${book.available ? 'status-available' : 'status-busy'}">
                            ${book.available ? '● В наличии' : '● На руках'}
                        </span>
                        <button class="btn-read" ${!book.available ? 'disabled' : ''}>
                            ${book.available ? 'Подробнее / Читать' : 'Недоступно'}
                        </button>
                    </div>
                </div>
            `;

            const readBtn = card.querySelector('.btn-read');
            if (book.available) {
                readBtn.addEventListener('click', () => openBookModal(book));
            }

            grid.appendChild(card);
        });
    }

    async function checkSession() {
        try {
            const response = await fetch('/api/profile', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                switchToLibrary(data);
            } else {
                switchToLogin();
            }
        } catch (err) {
            console.error('Ошибка соединения с сервером:', err);
        }
    }

    // Вход
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const login = document.getElementById('loginInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ login, password, role: selectedLoginRole })
            });

            const result = await response.json();

            if (!response.ok) {
                showError(result.message);
                return;
            }

            showToast(result.message);
            await checkSession();
        } catch (err) {
            showError('Ошибка сети. Проверьте, запущен ли сервер Flask.');
        }
    });

    // Регистрация нового пользователя
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideRegError();

        const full_name = document.getElementById('regNameInput').value;
        const age = document.getElementById('regAgeInput').value;
        const login = document.getElementById('regLoginInput').value;
        const department = document.getElementById('regDeptInput').value;
        const password = document.getElementById('regPasswordInput').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    full_name,
                    age,
                    login,
                    department,
                    password,
                    role: selectedRegRole
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showRegError(result.message);
                return;
            }

            // Подставляем созданный логин и роль в форму входа для удобного повторного входа после выхода
            setLoginRole(selectedRegRole);
            document.getElementById('loginInput').value = login.trim();
            document.getElementById('passwordInput').value = '';

            registerForm.reset();
            setRegRole(selectedRegRole);
            showToast(result.message);
            await checkSession();
        } catch (err) {
            showRegError('Ошибка сети. Проверьте, запущен ли сервер Flask.');
        }
    });

    // Выход
    logoutBtn.addEventListener('click', async () => {
        const confirmed = confirm('Вы действительно хотите завершить сеанс и выйти из библиотеки?');
        if (!confirmed) return;

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });
            const result = await response.json();
            showToast(result.message);
            switchToLogin();
        } catch (err) {
            showToast('Ошибка при выходе из системы');
        }
    });

    // Проверка доступа без входа (401)
    testUnauthorizedBtn.addEventListener('click', async () => {
        const response = await fetch('/api/profile');
        const result = await response.json();
        showToast(`Статус ${response.status}: ${result.message}`);
    });

    searchInput.addEventListener('input', applyFilters);
    onlyAvailableCheck.addEventListener('change', applyFilters);

    checkSession();
});
