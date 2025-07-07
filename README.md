# Secret Santa App :santa:

A simple secret santa gift exchange application, using Next.js 15, Postgres w Prisma as the ORM.

## :gear: Getting Started

### :warning: Prerequisites

- Docker
- pnpm

It is also recommended that you put the following on your `$PATH` variable for your shell:

```shell
export PATH="node_modules/.bin:$PATH"
```

This allows your shell to pick up any executable binaries in the local `node_modules` folder.

### :file_folder: Environment Variables

Create a `.env` file with:

```shell
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/secretsanta"
```

For testing, create a `.env.test` file with:

```shell
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/secretsanta_test"
```

## :package: Installation and setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/secret-santa-app.git
cd secret-santa-app
```

### 2. Install dependencies

Make sure you have pnpm installed:

```shell
corepack enable
pnpm install
```

### 3. Setting up the database

Ensure Docker is running. Then start the PostgreSQL service:

```shell
docker compose up -d
```

### 4. Create the database schema

```shell
pnpm prisma migrate dev
```

This creates the database schema and generates the Prisma client.

### 5. Seed the database (optional)

```shell
pnpm prisma db seed
```

## :test_tube: Run the development server

```shell
pnpm dev
```

App should be running at http://localhost:3000

## :triangular_ruler: Testing

### Unit Tests (Vitest)

```shell
pnpm test:unit
```

### End-to-End Tests (Playwright)

```shell
pnpm test:e2e
```

This will:

- Drop and recreate a test database (secretsanta_test
- Run schema migrations
- Launch your app locally on port 3000
- Run Playwright against it

## :question: Troubleshooting

### Prisma connection errors

If you see:

```shell
PrismaClientInitializationError: Database `secretsanta` does not exist
```

Make sure:

- Docker is running: `docker ps`
- The container is named `secret-santa-db`
- You ran the migration: `pnpm prisma migrate dev`

### Docker networking errors

- Restart Docker and try again
- Use `docker compose down -v && docker compose up -d` to reset the DB (`-v` removes the volume)

### Playwright global setup errors

- Ensure `.env.test` is valid and points to `secretsanta_test`
- Clear `.next/` and try rebuilding: `rm -rf .next && pnpm build`

# :file_cabinet: Database Structure and Design

This document provides an overview of the database schema for the Secret Santa application. It outlines the relationships between models and the structure of the data stored in the database.

## Models Overview

The following models are defined in the Prisma schema:

1. **User**
2. **Exchange**
3. **Member**
4. **Assignment**
5. **WishlistItem**

---

## **User Table**

| Field       | Type       | Description                         |
| ----------- | ---------- | ----------------------------------- |
| `id`        | `String`   | Primary key, UUID (unique)          |
| `email`     | `String`   | Unique email address of the user    |
| `name`      | `String`   | The name of the user                |
| `createdAt` | `DateTime` | Timestamp when the user was created |

### Relationships:

- **Members**: A user can belong to multiple exchanges through the `Member` model.
- **WishlistItems**: A user can have multiple wishlist items.

---

## **Exchange Table**

| Field       | Type       | Description                             |
| ----------- | ---------- | --------------------------------------- |
| `id`        | `String`   | Primary key, UUID (unique)              |
| `name`      | `String`   | Name of the exchange                    |
| `createdAt` | `DateTime` | Timestamp when the exchange was created |

### Relationships:

- **Members**: An exchange contains multiple members, linked through the `Member` model.
- **Assignments**: An exchange has multiple assignments, linked to the `Assignment` model.

---

## **Member Table**

| Field        | Type       | Description                                 |
| ------------ | ---------- | ------------------------------------------- |
| `id`         | `String`   | Primary key, UUID (unique)                  |
| `userId`     | `String`   | Foreign key linking to the `User` model     |
| `exchangeId` | `String`   | Foreign key linking to the `Exchange` model |
| `createdAt`  | `DateTime` | Timestamp when the member was created       |

### Relationships:

- **User**: A member is associated with a user through the `userId`.
- **Exchange**: A member is associated with an exchange through the `exchangeId`.
- **Assignments**: A member may be assigned as a giver or receiver in the `Assignment` model.

---

## **Assignment Table**

| Field                    | Type        | Description                                                |
| ------------------------ | ----------- | ---------------------------------------------------------- |
| `id`                     | `String`    | Primary key, UUID (unique)                                 |
| `exchangeId`             | `String`    | Foreign key linking to the `Exchange` model                |
| `giverId`                | `String`    | Foreign key linking to the `Member` model, the giver       |
| `receiverId`             | `String`    | Foreign key linking to the `Member` model, the receiver    |
| `selectedWishlistItemId` | `String`    | Foreign key linking to the `WishlistItem` model (optional) |
| `customGiftTitle`        | `String?`   | Optional custom gift title                                 |
| `customGiftUrl`          | `String?`   | Optional custom gift URL                                   |
| `giftGivenAt`            | `DateTime?` | Timestamp when the gift was given                          |
| `createdAt`              | `DateTime`  | Timestamp when the assignment was created                  |

### Relationships:

- **Exchange**: Each assignment is linked to a specific exchange.
- **Giver and Receiver**: The `giver` and `receiver` are linked to the `Member` model, with `giverId` and `receiverId` as foreign keys.
- **WishlistItem**: The `selectedWishlistItem` is an optional link to the `WishlistItem` model.

---

## **WishlistItem Table**

| Field         | Type       | Description                                    |
| ------------- | ---------- | ---------------------------------------------- |
| `id`          | `String`   | Primary key, UUID (unique)                     |
| `userId`      | `String`   | Foreign key linking to the `User` model        |
| `title`       | `String`   | Title of the wishlist item                     |
| `description` | `String?`  | Optional description of the wishlist item      |
| `url`         | `String?`  | Optional URL associated with the wishlist item |
| `createdAt`   | `DateTime` | Timestamp when the wishlist item was created   |

### Relationships:

- **User**: Each wishlist item is associated with a specific user.
- **Assignments**: A wishlist item can be selected for an assignment as the chosen gift.

---

## Relationships Summary

- **User ↔ Member**: A user can have many members through different exchanges.
- **Exchange ↔ Member**: An exchange can have many members.
- **Member ↔ Assignment**: A member can be a giver or receiver in one or more assignments.
- **Assignment ↔ WishlistItem**: Each assignment can be linked to a wishlist item, representing the gift chosen.

---

## Diagram

```mermaid
erDiagram
    USER {
        String id PK
        String email
        String name
        DateTime createdAt
    }
    EXCHANGE {
        String id PK
        String name
        DateTime createdAt
    }
    MEMBER {
        String id PK
        String userId FK
        String exchangeId FK
        DateTime createdAt
    }
    ASSIGNMENT {
        String id PK
        String exchangeId FK
        String giverId FK
        String receiverId FK
        String selectedWishlistItemId FK
        String customGiftTitle
        String customGiftUrl
        DateTime giftGivenAt
        DateTime createdAt
    }
    WISHLISTITEM {
        String id PK
        String userId FK
        String title
        String description
        String url
        DateTime createdAt
    }

    USER ||--o{ MEMBER : has
    EXCHANGE ||--o{ MEMBER : has
    MEMBER ||--o{ ASSIGNMENT : gives
    MEMBER ||--o{ ASSIGNMENT : receives
    ASSIGNMENT ||--o{ WISHLISTITEM : selects
    USER ||--o{ WISHLISTITEM : has
```
