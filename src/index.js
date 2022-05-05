const Facebook = require('./facebook.class')

const main = async () => {
    const facebook = new Facebook('aniko.udud.5')

    await facebook.open().then(async () => await facebook.login())

    const user = await facebook.getUser()
    const friends = await facebook.getFriends()

    console.log(user, friends)

    //await facebook.close()
}

try {
    main()
} catch (error) {
    console.log(error)
}