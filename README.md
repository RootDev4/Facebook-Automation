# Facebook Automation
A tool to automatically scrape Facebook data from an user's profile.

Work in progress.

## Usage

Initialize a new facebook object with numeric/vanity ID of user.

```javascript
const facebook = new Facebook('zuck')
```

### Open facebook and login (optional)

Open facebook and perform login. This is optional, but some actions requires a loggedin user.

```javascript
await facebook.open().then(async () => await facebook.login())
```

### Get user's data

Returns numeric ID, username and (if exists) vanity ID.

```javascript
const user = await facebook.getUser()
```

### Get user's friends

Returns a list of a user's friends (containing user ID, username and profile URL).

```javascript
const user = await facebook.getFriends()
```

### Get user's friends

Close facebook.

```javascript
await facebook.close()
```

### More is coming...

- User's photos
- User's posts
- ...