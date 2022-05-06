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
const friends = await facebook.getFriends()
```

### Get user's photos

Returns a list of a user's photos.

```javascript
const photos = await facebook.getPhotos()
```

### Close

Close facebook.

```javascript
await facebook.close()
```

### More is coming...

## Configuration

Open config.js file for configuration.

### Debugging mode

Turn debugging mode on/off

```
debug: true/false
```
### Browser settings

Set browser visibility on/off

```
visible: true/false
```

Set a custom user agent string

```
useragent: '<your-custom-user-agent-string>'
```

Set timeout in milliseconds to wait for a page has loaded.
In this example, timeout variable was set to 30 seconds.

```
timeout: 30000
```

Set browser proxy in host:port format.
In this example, proxy variable was set to https://127.0.0.1:8000 for a HTTPS proxy. If you wish to use a torified network (Tor Browser), set proxy to socks5://127.0.0.1:9050 with a running Tor client in the background.

```
proxy: 'https://127.0.0.1:8000'
```

Set further browser options.
In this example, the browser was set to use no sandboxes and ignore certificate errors.

```
options: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
```
### Facebook login data

Set username and password of an existing Facebook account

```
username: 'foo@example.com',
password: 'helloworld'
```
