# TravelPlacesTracker

Веб-додаток "Трекер місць для подорожей":
Завдання:
Створити веб-додаток, де користувачі можуть створювати список місць, які вони хочуть відвідати на основі знайдених згідно пошуку за параметрами (ключеве слово, геолокація).
Опис:
Використати будь-який публічний API (наприклад  Foursquare Places API), для отримання інформації про популярні туристичні місця.
Користувач може додавати місця у свій список бажань (wishlist) і переглядати деталі про кожне місце: рейтинг, тип, фотографії, поради\відгуки.
Реалізувати простий кеш, щоб не робити повторні запити до API для того самого міста протягом 10 хвилин.
Список збережених місць повинен зберігатися у локальному сховищі, щоб не зникали при перезавантаженні сторінки.

# Start

For starting run _ng serve --proxy-config proxy.conf.json_ in console.
I'm using proxy.conf.json file, because facing CORS error in browser when trying to fetch API.

As soon as I don't have log in functionality required, issue is recieving API_key for APIs, so in envirinments.ts file I placed API key and url for Foursquare API. This is not secure, but I left it for reviewing and testing porpuses.