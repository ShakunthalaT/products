# Authentication

Given an `app.js` file and a database file `userData.db` consisting of a table `user`.

Write APIs to perform operations on the table `user` containing the following columns,

**User Table**

| Column   | Type |
| -------- | ---- |
| username | TEXT |
| name     | TEXT |
| password | TEXT |
| gender   | TEXT |
| location | TEXT |

### API 1

#### Path: `/register`

#### Method: `POST`

**Request**

```
{
  "username": "shakunthala",
  "name": "shakunthala12",
  "password": "Roja@123",
  "gender": "Female",
  "location": "chittoor"
}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      User already exists
      ```

- **Scenario 2**

  - **Description**:

    If the registrant provides a password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful registration of the registrant

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
    ```
    User created successfully
    ```

### API 2

#### Path: `/login`

#### Method: `POST`

**Request**

```
{
  "username": "shakunthala",
  "password": "Roja@123"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Login success!
      ```

### API 3

#### Path: `/products`

#### Method: `Post`

**Request**
{
id INTEGER,
image_url TEXT,
description TEXT
}

**Response**
{product successfully added}

### API 4

#### Path: `/products/:id`

#### Method: `DELETE`

**Request**
\*\* give which id we want to delete

**Response**
{product removed}

### API 5

#### Path: `/products/`

#### Method: `GET`

**Response**
\*\* we will get all the products

### API 6

#### Path: `/products/:id`

#### Method: `PUT`

**Request**

\*\* {description}

**Response**

\*\* we will get updated the product description
