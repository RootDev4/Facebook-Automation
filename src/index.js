const Facebook = require('./facebook.class')

const main = async () => {

    // Init facebook object with numeric/vanity ID of user
    const facebook = new Facebook('zuck')

    // Open facebook and login (optional)
    await facebook.open().then(async () => await facebook.login())

    // Get user data
    const user = await facebook.getUser()

    // Get a list of user's friends (requires login)
    const friends = await facebook.getFriends()

    // Output
    console.log(user, friends)

    // Close facebook
    await facebook.close()
}

// Run
try {
    main()
} catch (error) {
    console.log(error)
}