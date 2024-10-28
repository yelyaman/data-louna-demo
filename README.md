# Описание сервиса аутентификации и покупок

Сервис предоставляет пользователям функциональность аутентификации и возможность покупки игровых скинов. Он использует JWT для безопасной авторизации и Redis для управления токенами.

## Как работает авторизация

1. **Регистрация (Signup)**: Пользователь создает учетную запись, предоставляя необходимые данные.
2. **Вход (Sign In)**: Пользователь вводит свои учетные данные, сервис проверяет их и выдает JWT токены:
   - **Access Token**: Краткосрочный токен, действующий 2 минуты.
   - **Refresh Token**: Долгосрочный токен, хранящийся в Redis, который можно использовать для получения нового access токена.
3. **Выход (Sign Out)**: Пользователь может выйти из системы, что аннулирует все токены.

## Доступные эндпоинты

### Эндпоинты аутентификации
- `POST /auth/signup`: Регистрация нового пользователя.
- `POST /auth/signin`: Вход пользователя и получение токенов.
- `GET /auth/info`: Получение информации о пользователе.
- `PATCH /auth/change-password`: Изменение пароля пользователя.
- `GET /auth/refresh`: Обновление access токена с использованием refresh токена.
- `GET /auth/signout`: Выход из системы.

### Эндпоинты для покупок
- `POST /purchase`: Покупка скина, включая информацию о платеже.
  
### Эндпоинты для работы с скинами
- `GET /skinport/get-minimim-prices`: Получение минимальных цен на скины с внешнего API (Skinport).

## Схема отношений сущностей

### Сущности и их поля

1. **User**
   - `id`: UUID (первичный ключ)
   - `balance`: Один к одному с `Balance`
   - `purchases`: Один ко многим с `Purchase`
   - `email`: строка
   - `password`: строка
   - `skins`: Многие ко многим с `Skin`
   - `createdAt`: дата создания
   - `updatedAt`: дата обновления
   - `deletedAt`: дата удаления

2. **Balance**
   - `id`: UUID (первичный ключ)
   - `user`: Один к одному с `User`
   - `amount`: число (по умолчанию 0)
   - `createdAt`: дата создания
   - `updatedAt`: дата обновления
   - `deletedAt`: дата удаления

3. **Purchase**
   - `id`: UUID (первичный ключ)
   - `user`: Многие к одному с `User`
   - `skinId`: строка
   - `quantity`: число
   - `transaction`: Один к одному с `SkinTransaction`
   - `createdAt`: дата создания
   - `updatedAt`: дата обновления
   - `deletedAt`: дата удаления

4. **Skin**
   - `id`: UUID (первичный ключ)
   - `marketHashName`: строка
   - `price`: число
   - `quantity`: число
   - `users`: Многие ко многим с `User`
   - `createdAt`: дата создания
   - `updatedAt`: дата обновления
   - `deletedAt`: дата удаления

5. **SkinTransaction**
   - `id`: UUID (первичный ключ)
   - `totalAmount`: число (тип float)
   - `paymentMethod`: строка
   - `purchase`: Один к одному с `Purchase`
   - `createdAt`: дата создания
   - `updatedAt`: дата обновления
   - `deletedAt`: дата удаления


# ER-диаграмма для сервиса

## Описание сущностей

### 1. User
- `id`: UUID (PK)
- `email`: строка
- `password`: строка
- `balance`: связь один к одному с Balance
- `purchases`: связь один ко многим с Purchase
- `skins`: связь многие ко многим с Skin

### 2. Balance
- `id`: UUID (PK)
- `amount`: число с плавающей точкой (по умолчанию 0)
- `user`: связь один к одному с User

### 3. Purchase
- `id`: UUID (PK)
- `skinId`: строка
- `quantity`: целое число
- `user`: связь многие к одному с User
- `transaction`: связь один к одному с SkinTransaction

### 4. Skin
- `id`: UUID (PK)
- `marketHashName`: строка
- `price`: число с плавающей точкой
- `quantity`: целое число
- `users`: связь многие ко многим с User

### 5. SkinTransaction
- `id`: UUID (PK)
- `totalAmount`: число с плавающей точкой
- `paymentMethod`: строка
- `purchase`: связь один к одному с Purchase

## Отношения между сущностями
- **User** ↔ **Balance**: Один к одному
- **User** ↔ **Purchase**: Один ко многим
- **User** ↔ **Skin**: Многие ко многим (через вспомогательную таблицу `user_skins`)
- **Purchase** ↔ **SkinTransaction**: Один к одному
- **Skin** ↔ **User**: Многие ко многим (через вспомогательную таблицу `user_skins`)

## ER-диаграмма

```mermaid
erDiagram
    User {
        UUID id PK
        string email
        string password
    }
    
    Balance {
        UUID id PK
        float amount
    }

    Purchase {
        UUID id PK
        string skinId
        int quantity
    }

    Skin {
        UUID id PK
        string marketHashName
        float price
        int quantity
    }

    SkinTransaction {
        UUID id PK
        float totalAmount
        string paymentMethod
    }

    User ||--|| Balance : has
    User ||--o| Purchase : makes
    User ||--o| Skin : owns
    Purchase ||--|| SkinTransaction : generates
    Skin ||--o| User : ownedBy

## Заключение

Если что то не так, можете плз написать комменты в hh или в git :)
