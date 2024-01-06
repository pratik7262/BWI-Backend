# API Documentation

## Base URL

The base URL for the API is `http://localhost` if you run the server on a local system.

## User Routes

### Create User

- **Route:** `/api/user/create`
- **Method:** `POST`
- **Data Format:** Form Data

#### Request

Example using curl:

```bash
curl -X POST http://localhost/api/user/create \
  -F name="John Doe" \
  -F email="john.doe@example.com" \
  -F phoneNumber="1234567890" \
  -F password="securepassword" \
  -F profileImg=@path/to/image.png
```

`name` (string): User's name
`email` (string): User's email
`phoneNumber`(string): User's phone number
`password` (string): User's password
`profileImg` (file): User's profile image (in .png, .jpeg, or .jpg format)

#### Response

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true,
  "message": "User created successfully"
}
```

`token` (string): User authentication token
`success` (boolean): Indicates if the operation was successful
`message` (string): Message confirming the user creation success

### User Sign In

- **Route:** `/api/user/signin`
- **Method:** `POST`
- **Data Format:** JSON

#### Request

Example using curl:

```bash
curl -X POST http://localhost/api/user/signin \
  -H "Content-Type: application/json" \
  -d '{"credential": "john.doe@example.com", "password": "securepassword"}'
```

`credential` (string): User's email or phone number
`password` (string): User's password

#### Response

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true,
  "message": "User signed in successfully"
}
```

`token` (string): User authentication token of user
`success` (boolean): Indicates if the operation was successful
`message` (string): Message confirming the user sign-in success

### Change User Information

- **Route:** `/api/user/changeinfo`
- **Method:** `PATCH`
- **Headers:** `token` (string): Authorization token of user
- **Data Format:** Form Data (name and/or profileImg)

#### Request

Example using curl:

```bash
curl -X PATCH http://localhost/api/user/changeinfo \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F name="New Name" \
  -F profileImg=@path/to/newimage.png
```

`token` (string): Authorization token of user
`name` (string): New user's name
`profileImg` (file): New user's profile image (in .png, .jpeg, or .jpg format)

#### Response

```bash
{
  "success": true,
  "message": "User information updated successfully",
  "userData": "User Information From Database"
}
```

`success` (boolean): Indicates if the operation was successful
`message` (string): Message confirming the user information update success
`userData` (object): User data with updated information

### Delete User Account

- **Route:** `/api/user/deleteaccount`
- **Method:** `DELETE`
- **Headers:** `token` (string): Authorization token of user

#### Request

Example using curl:

```bash
curl -X DELETE http://localhost/api/user/deleteaccount \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

`token` (string): Authorization token of user

#### Response

```bash
{
  "success": true,
  "message": "User account deleted successfully"
}
```

`success` (boolean): Indicates if the operation was successful
`message` (string): Message confirming the user account deletion success

## Admin Routes

### Create Admin

**Route:** `/api/admin/create`

**Method:** `POST`

**Data Format:** Form Data

- `name` (string): Admin's name
- `email` (string): Admin's email
- `phoneNumber` (string): Admin's phone number
- `password` (string): Admin's password
- `profileImg` (file): Admin's profile image (in .png, .jpeg, or .jpg format)

#### Request

```bash
curl -X POST http://localhost/api/admin/create \
  -F name="Admin Name" \
  -F email="admin@example.com" \
  -F phoneNumber="1234567890" \
  -F password="adminpassword" \
  -F profileImg=@path/to/adminimage.png
```

#### Response

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true,
  "message": "Admin created successfully"
}
```

### Admin Sign In

**Route:** `/api/admin/signin`

**Method:** `POST`

**Data Format:** JSON

- `credential` (string): Admin's email or phone number
- `password` (string): Admin's password

#### Request

```bash
curl -X POST http://localhost/api/admin/signin \
  -H "Content-Type: application/json" \
  -d '{"credential": "admin@example.com", "password": "adminpassword"}'
```

#### Response

```bash
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "success": true,
  "message": "Admin signed in successfully"
}
```

### Get All User Information

**Route:** `/api/admin/getalluser`

**Method:** `GET`

**Headers:**

- `token` (string): Authorization token of admin

#### Request

```bash
curl -X GET http://localhost/api/admin/getalluser \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response

```bash
    {
  "userData": [
    {
      "_id": "user_id1",
      "name": "User1",
      "profileImg": "path/to/user1image.png"
    },
    {
      "_id": "user_id2",
      "name": "User2",
      "profileImg": "path/to/user2image.png"
    },
    // ...more users
  ]
}
```

### Change User Information by Admin

**Route:** `/api/admin/changeuserinfo/:userId`

**Method:** `PATCH`

**Headers:**

- `token` (string): Authorization token of admin

**Params:**

- `userId` (string): User's MongoDB ID

**Data Format:** Form Data (name and/or profileImg)

#### Request:\*\*

```bash
curl -X PATCH http://localhost/api/admin/changeuserinfo/user_id1 \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F name="New Name" \
  -F profileImg=@path/to/newuserimage.png
```

#### Response

```bash
{
  "success": true,
  "message": "User information updated successfully"
}
```

### Delete User Account by Admin

**Route:** `/api/admin/deleteuser/:userId`

**Method:** `DELETE`

**Headers:**

- `token` (string): Authorization token of admin

**Params:**

- `userId` (string): User's MongoDB ID

#### Request

```bash
curl -X DELETE http://localhost/api/admin/deleteuser/user_id1 \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response

```bash
{
  "success": true,
  "message": "User account deleted successfully"
}
```
