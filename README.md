# Backend Project README

## Description

This project is a backend application developed using Nest.js and Type ORM. The application provides API endpoints to manage book management system.

## Environment Variables

Before running the project, ensure that the following environment variables are set in a `.env.dev` file:

```plaintext
JWT_SECRET=very-secure-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=pgpass
DB_NAME=book_db
```

## Installing Dependencies

To install the project dependencies, run the following command:

```bash
npm install
```

## DB Migrate

To create migration files you can use following command:

```bash
npm run migration:generate -- ./src/db/migrations/migration_name
```

To apply migration files you can use following command:

```bash
npm run migration:run
```

To revert migration files you can use following command:

```bash
npm run migration:revert
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

# Test Enviroment Variables
Before running the tests, ensure that the following environment variables are set in a `.env.test` file:

```plaintext
NODE_ENV=test
JWT_SECRET=very-secure-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=pgpass
DB_NAME=book_db_test
```

# Test Command

```bash
# e2e tests
$ npm run test:e2e -- --runInBand

# unit tests
$ npm run test
```

### Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications. It provides a modular architecture that makes the codebase organized and maintainable.
- **TypeORM**: An Object-Relational Mapper (ORM) that helps to interact with the PostgreSQL database seamlessly. It provides a type-safe way to manage database entities and relationships.
- **PostgreSQL**: A powerful, open-source object-relational database system. It is used here for its reliability and robustness in handling complex queries.
- **Supertest**: A library for testing HTTP servers in Node.js. It is used for writing end-to-end tests for the API.
- **Jest**: A delightful JavaScript testing framework that provides a great testing experience for unit and end-to-end tests.