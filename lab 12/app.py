import json
import os
from datetime import timedelta, datetime, timezone
from flask import Flask, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# Фиксированный секретный ключ, чтобы сессия и cookie оставались валидными даже при автоперезагрузке Flask
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "libaccess-atu-lab12-fixed-secret-2026")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, "users_db.json")

# Настройки безопасности сессии
SESSION_LIFETIME_SECONDS = 300  # 5 минут жизни сессии
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,   # Защита от XSS (JS не может прочитать cookie)
    SESSION_COOKIE_SAMESITE='Lax',  # Защита от CSRF
    PERMANENT_SESSION_LIFETIME=timedelta(seconds=SESSION_LIFETIME_SECONDS)
)

ROLE_CONFIG = {
    "school": {
        "role_label": "Школьник",
        "min_age": 7,
        "max_age": 17,
        "default_age": 15,
        "default_dept": "Средняя школа №48"
    },
    "student": {
        "role_label": "Студент",
        "min_age": 17,
        "max_age": 26,
        "default_age": 19,
        "default_dept": "Информационные системы, АТУ"
    },
    "teacher": {
        "role_label": "Учитель",
        "min_age": 21,
        "max_age": 80,
        "default_age": 34,
        "default_dept": "Кафедра прикладной математики и информатики"
    }
}

DEFAULT_USERS = {
    "school": {
        "password_hash": generate_password_hash("12345"),
        "full_name": "Тимур Сериков",
        "role_key": "school",
        "role": "Школьник",
        "age": 15,
        "card_number": "LIB-SCH-014",
        "department": "Средняя школа №48, 9 класс"
    },
    "student": {
        "password_hash": generate_password_hash("12345"),
        "full_name": "Алан Тулегенов",
        "role_key": "student",
        "role": "Студент",
        "age": 19,
        "card_number": "LIB-STU-084",
        "department": "ИС 25-21, АТУ"
    },
    "teacher": {
        "password_hash": generate_password_hash("12345"),
        "full_name": "Елена Смирнова",
        "role_key": "teacher",
        "role": "Учитель",
        "age": 36,
        "card_number": "LIB-TCH-009",
        "department": "Кафедра информатики и методики преподавания"
    }
}


def load_users_db():
    if not os.path.exists(USERS_FILE):
        save_users_db(DEFAULT_USERS)
        return dict(DEFAULT_USERS)
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict) and data:
                return data
    except (OSError, json.JSONDecodeError):
        pass
    return dict(DEFAULT_USERS)


def save_users_db(users_data):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users_data, f, ensure_ascii=False, indent=2)


# Инициализация файла пользователей при старте
load_users_db()

# Расширенный каталог учебников и книг по ролям и возрасту
BOOKS_CATALOG = [
    # --- ШКОЛЬНЫЕ УЧЕБНИКИ (также доступны учителям) ---
    {
        "id": 1,
        "title": "Алгебра и начала анализа. 9 класс",
        "author": "А. Е. Абылкасымова, Т. П. Кучер",
        "year": 2023,
        "subject": "Математика",
        "category": "Школьный курс • 13–17 лет",
        "min_age": 13,
        "max_age": 17,
        "audience": ["school", "teacher"],
        "cover_color": "linear-gradient(135deg, #0284c7, #38bdf8)",
        "pages": 256,
        "rating": 4.8,
        "available": True,
        "summary": "Квадратичные функции, прогрессии, элементы тригонометрии и комбинаторики с пошаговым разбором олимпиадных задач."
    },
    {
        "id": 2,
        "title": "Основы алгоритмизации и Python для школьников",
        "author": "Д. М. Златопольский",
        "year": 2024,
        "subject": "Информатика",
        "category": "Школьный курс • 12–17 лет",
        "min_age": 12,
        "max_age": 17,
        "audience": ["school", "teacher"],
        "cover_color": "linear-gradient(135deg, #059669, #34d399)",
        "pages": 224,
        "rating": 4.9,
        "available": True,
        "summary": "Введение в программирование на Python: циклы, списки, строки, функции и первые графические мини-игры."
    },
    {
        "id": 3,
        "title": "Физика: механика, оптика и электричество. 8–10 класс",
        "author": "Б. А. Кронгарт, В. И. Кем",
        "year": 2022,
        "subject": "Физика",
        "category": "Школьный курс • 13–17 лет",
        "min_age": 13,
        "max_age": 17,
        "audience": ["school", "teacher"],
        "cover_color": "linear-gradient(135deg, #4338ca, #6366f1)",
        "pages": 304,
        "rating": 4.7,
        "available": True,
        "summary": "Законы Ньютона, сохранение энергии, электрические цепи и лабораторные эксперименты с наглядными схемами."
    },
    {
        "id": 4,
        "title": "Всемирная история и география: атлас-справочник",
        "author": "К. М. Атантаева",
        "year": 2022,
        "subject": "История",
        "category": "Школьный курс • 10–17 лет",
        "min_age": 10,
        "max_age": 17,
        "audience": ["school"],
        "cover_color": "linear-gradient(135deg, #d97706, #fbbf24)",
        "pages": 312,
        "rating": 4.6,
        "available": True,
        "summary": "Ключевые исторические эпохи, карты цивилизаций, хронологические таблицы и подготовка к итоговой аттестации."
    },
    {
        "id": 5,
        "title": "Биология и экология живых систем. 7–9 класс",
        "author": "Н. Г. Асанов, А. Р. Соловьева",
        "year": 2023,
        "subject": "Биология",
        "category": "Школьный курс • 11–17 лет",
        "min_age": 11,
        "max_age": 17,
        "audience": ["school"],
        "cover_color": "linear-gradient(135deg, #15803d, #4ade80)",
        "pages": 240,
        "rating": 4.7,
        "available": False,
        "summary": "Строение клетки, генетика, экосистемы Земли и практикум по наблюдению за природой."
    },
    {
        "id": 6,
        "title": "Занимательная логика и математические головоломки",
        "author": "Я. И. Перельман",
        "year": 2021,
        "subject": "Математика",
        "category": "Школьный курс • 9–17 лет",
        "min_age": 9,
        "max_age": 17,
        "audience": ["school"],
        "cover_color": "linear-gradient(135deg, #0f766e, #2dd4bf)",
        "pages": 192,
        "rating": 4.9,
        "available": True,
        "summary": "Классический сборник нестандартных задач на смекалку, геометрию и пространственное мышление."
    },

    # --- ВУЗОВСКИЕ УЧЕБНИКИ ДЛЯ СТУДЕНТОВ (также доступны учителям/преподавателям) ---
    {
        "id": 7,
        "title": "Многомерный анализ и дифференциальные уравнения",
        "author": "Л. Д. Кудрявцев",
        "year": 2023,
        "subject": "Высшая математика",
        "category": "ВУЗ • 18+ лет",
        "min_age": 18,
        "max_age": 99,
        "audience": ["student", "teacher"],
        "cover_color": "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        "pages": 512,
        "rating": 4.8,
        "available": True,
        "summary": "Частные производные, кратные и криволинейные интегралы, ряды Фурье и теория поля для инженерных специальностей."
    },
    {
        "id": 8,
        "title": "Реляционные базы данных и SQL на практике",
        "author": "М. Грубер",
        "year": 2024,
        "subject": "Базы данных",
        "category": "ВУЗ • 18+ лет",
        "min_age": 18,
        "max_age": 99,
        "audience": ["student", "teacher"],
        "cover_color": "linear-gradient(135deg, #4f46e5, #818cf8)",
        "pages": 448,
        "rating": 4.9,
        "available": True,
        "summary": "Проектирование ER-диаграмм, нормализация, сложные JOIN-запросы, транзакции и оптимизация индексов в MySQL."
    },
    {
        "id": 9,
        "title": "Архитектура веб-приложений, JWT и безопасность",
        "author": "Э. Таненбаум, М. ван Стеен",
        "year": 2024,
        "subject": "Web и безопасность",
        "category": "ВУЗ • 18+ лет",
        "min_age": 18,
        "max_age": 99,
        "audience": ["student", "teacher"],
        "cover_color": "linear-gradient(135deg, #6d28d9, #a78bfa)",
        "pages": 620,
        "rating": 4.9,
        "available": True,
        "summary": "Механизмы аутентификации и авторизации, OAuth 2.0, OpenID Connect, защита cookie от XSS и CSRF."
    },
    {
        "id": 10,
        "title": "Дискретная математика и теория графов",
        "author": "Ф. А. Новиков",
        "year": 2023,
        "subject": "Высшая математика",
        "category": "ВУЗ • 17+ лет",
        "min_age": 17,
        "max_age": 99,
        "audience": ["student", "teacher"],
        "cover_color": "linear-gradient(135deg, #0369a1, #38bdf8)",
        "pages": 416,
        "rating": 4.7,
        "available": True,
        "summary": "Булева алгебра, комбинаторика, деревья, кратчайшие пути в графах и конечные автоматы."
    },
    {
        "id": 11,
        "title": "Искусственный интеллект: современный подход",
        "author": "С. Рассел, П. Норвиг",
        "year": 2024,
        "subject": "AI и анализ данных",
        "category": "ВУЗ • 18+ лет",
        "min_age": 18,
        "max_age": 99,
        "audience": ["student", "teacher"],
        "cover_color": "linear-gradient(135deg, #065f46, #10b981)",
        "pages": 1120,
        "rating": 5.0,
        "available": True,
        "summary": "Эвристический поиск, машинное обучение, нейронные сети, обработка естественного языка и вероятностные модели."
    },
    {
        "id": 12,
        "title": "Чистый код. Создание, анализ и рефакторинг",
        "author": "Роберт Мартин",
        "year": 2022,
        "subject": "Разработка ПО",
        "category": "ВУЗ • 17+ лет",
        "min_age": 17,
        "max_age": 99,
        "audience": ["student", "teacher"],
        "cover_color": "linear-gradient(135deg, #1e293b, #64748b)",
        "pages": 464,
        "rating": 4.9,
        "available": False,
        "summary": "Принципы SOLID, именование, модульное тестирование и архитектура поддерживаемых программных систем."
    },

    # --- МЕТОДИКА И ПЕДАГОГИКА ДЛЯ УЧИТЕЛЕЙ (21+ лет) ---
    {
        "id": 13,
        "title": "Методика преподавания информатики и цифровой педагогики",
        "author": "М. П. Лапчик",
        "year": 2024,
        "subject": "Педагогика",
        "category": "Педагогика • 21+ лет",
        "min_age": 21,
        "max_age": 99,
        "audience": ["teacher"],
        "cover_color": "linear-gradient(135deg, #9f1239, #fb7185)",
        "pages": 384,
        "rating": 4.8,
        "available": True,
        "summary": "Современные образовательные технологии, организация лабораторных практикумов и проектная деятельность."
    },
    {
        "id": 14,
        "title": "Проектирование учебных программ и критериальное оценивание",
        "author": "А. А. Буркитова",
        "year": 2024,
        "subject": "Педагогика",
        "category": "Педагогика • 21+ лет",
        "min_age": 21,
        "max_age": 99,
        "audience": ["teacher"],
        "cover_color": "linear-gradient(135deg, #115e59, #2dd4bf)",
        "pages": 296,
        "rating": 4.7,
        "available": True,
        "summary": "Разработка силлабусов, рубрикаторов оценки компетенций и интерактивных форматов контроля знаний."
    },
    {
        "id": 15,
        "title": "Психология высшей школы и наставничество",
        "author": "С. Д. Смирнов",
        "year": 2023,
        "subject": "Педагогика",
        "category": "Педагогика • 21+ лет",
        "min_age": 21,
        "max_age": 99,
        "audience": ["teacher"],
        "cover_color": "linear-gradient(135deg, #7c2d12, #f97316)",
        "pages": 352,
        "rating": 4.8,
        "available": True,
        "summary": "Мотивация студентов, когнитивные стратегии обучения и эффективная коммуникация в академической среде."
    }
]


def get_books_for_user(user_info):
    age = int(user_info.get("age", 18))
    role_key = user_info.get("role_key", "student")
    allowed = []

    for book in BOOKS_CATALOG:
        age_ok = book["min_age"] <= age <= book["max_age"]
        role_ok = role_key in book["audience"]
        if age_ok and role_ok:
            allowed.append(book)

    return allowed


def create_user_session(username):
    session.permanent = True
    session['user'] = username
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=SESSION_LIFETIME_SECONDS)
    session['expires_at'] = expires_at.timestamp()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get('login', '').strip()
    password = data.get('password', '').strip()
    selected_role = data.get('role', '').strip()

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Ошибка: заполните оба поля (логин и пароль)."
        }), 400

    users = load_users_db()
    user = users.get(username)
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({
            "success": False,
            "message": "Неверный логин или пароль. Проверьте данные или зарегистрируйтесь."
        }), 401

    if selected_role and user.get('role_key') != selected_role:
        expected_label = ROLE_CONFIG.get(user.get('role_key'), {}).get('role_label', user.get('role'))
        return jsonify({
            "success": False,
            "message": f"Этот логин зарегистрирован с ролью «{expected_label}». Выберите её выше."
        }), 403

    create_user_session(username)

    return jsonify({
        "success": True,
        "message": f"Вход выполнен как «{user['role']}»!",
        "expires_in": SESSION_LIFETIME_SECONDS
    }), 200


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    full_name = data.get('full_name', '').strip()
    username = data.get('login', '').strip()
    password = data.get('password', '').strip()
    role_key = data.get('role', 'student').strip()
    department = data.get('department', '').strip()

    if role_key not in ROLE_CONFIG:
        return jsonify({
            "success": False,
            "message": "Ошибка: выберите корректную роль (Школьник, Студент или Учитель)."
        }), 400

    role_meta = ROLE_CONFIG[role_key]

    try:
        age = int(data.get('age', role_meta['default_age']))
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Ошибка: укажите корректный возраст числом."
        }), 400

    if not full_name or not username or not password:
        return jsonify({
            "success": False,
            "message": "Ошибка: заполните имя, логин и пароль."
        }), 400

    if len(password) < 4:
        return jsonify({
            "success": False,
            "message": "Ошибка: пароль должен быть не короче 4 символов."
        }), 400

    if age < role_meta['min_age'] or age > role_meta['max_age']:
        return jsonify({
            "success": False,
            "message": (
                f"Для роли «{role_meta['role_label']}» допустимый возраст от "
                f"{role_meta['min_age']} до {role_meta['max_age']} лет."
            )
        }), 400

    users = load_users_db()
    if username in users:
        return jsonify({
            "success": False,
            "message": "Пользователь с таким логином уже существует."
        }), 409

    prefix_map = {"school": "SCH", "student": "STU", "teacher": "TCH"}
    card_number = f"LIB-{prefix_map[role_key]}-{len(users) + 100:03d}"

    users[username] = {
        "password_hash": generate_password_hash(password),
        "full_name": full_name,
        "role_key": role_key,
        "role": role_meta["role_label"],
        "age": age,
        "card_number": card_number,
        "department": department or role_meta["default_dept"]
    }
    save_users_db(users)

    create_user_session(username)

    return jsonify({
        "success": True,
        "message": f"Аккаунт «{username}» сохранён! Открыт каталог для роли «{role_meta['role_label']}».",
        "expires_in": SESSION_LIFETIME_SECONDS
    }), 201


@app.route('/api/profile', methods=['GET'])
def get_profile():
    username = session.get('user')
    expires_at = session.get('expires_at', 0)
    now = datetime.now(timezone.utc).timestamp()

    if not username or now > expires_at:
        session.clear()
        return jsonify({
            "authenticated": False,
            "message": "Сессия не найдена или истекла (HTTP 401 Unauthorized)."
        }), 401

    users = load_users_db()
    user_info = users.get(username)
    if not user_info:
        session.clear()
        return jsonify({
            "authenticated": False,
            "message": "Пользователь не найден (HTTP 401 Unauthorized)."
        }), 401

    remaining_seconds = int(expires_at - now)
    filtered_books = get_books_for_user(user_info)

    return jsonify({
        "authenticated": True,
        "profile": {
            "login": username,
            "full_name": user_info["full_name"],
            "role_key": user_info["role_key"],
            "role": user_info["role"],
            "age": user_info["age"],
            "card_number": user_info["card_number"],
            "department": user_info["department"]
        },
        "books": filtered_books,
        "total_catalog_count": len(BOOKS_CATALOG),
        "remaining_seconds": remaining_seconds
    }), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        "success": True,
        "message": "Вы вышли из системы. Аккаунт сохранён, сессия закрыта."
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
