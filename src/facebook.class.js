const Browser = require('./browser.class')
const config = require('../config')
const fbstatics = require('./facebook.statics')

/**
 * 
 */
module.exports = class Facebook {

    /**
     * 
     * @param {*} uid Facebook user id
     */
    constructor(uid) {
        if (!uid) throw new Error('No Facebook user id set.')
        if (!/^[a-z0-9.]+$/i.test(uid)) throw new Error('Invalid user id.')

        //
        this.userId = uid.toString().toLowerCase().trim()

        // Start browser in debugging mode (disabled by default; enable in config.js file)
        this.browser = new Browser(config.debug)

        // Configure browser
        if (config.browser.visible) this.browser.setVisible()
        if (config.browser.options.length) this.browser.setOptions(config.browser.options)
        if (config.browser.useragent.length) this.browser.setUserAgent(config.browser.useragent)
        if (config.browser.timeout > 0) this.browser.setTimeout(config.browser.timeout)
        if (config.browser.proxy.length) this.browser.setProxy(config.browser.proxy)
    }

    /**
     * 
     * @returns 
     */
    open() {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.browser.launch())
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @returns 
     */
    login() {
        return new Promise(async (resolve, reject) => {
            try {
                const url = `${fbstatics.prefix}${fbstatics.mobile}/${fbstatics.login}`

                await this.browser.page.goto(url, { waitUntil: 'load', timeout: this.timeout })
                await this.browser.page.waitForSelector('div#root')
                await this.browser.page.type('input#m_login_email', config.login.username)
                await this.browser.page.type('input#m_login_password', config.login.password)
                await this.browser.page.evaluate(btn => btn.click(), await this.browser.page.$('[name="login"]'))
                await this.browser.page.waitForSelector('div#rootcontainer', { waitUntil: 'load', timeout: this.browser.timeout })

                // TO-DO: check if login failed

                if (config.debug) console.log(`[${Date()}] Facebook login was successful`)

                resolve(this.browser.page.cookies())
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @returns 
     */
    getUser() {
        return new Promise(async (resolve, reject) => {
            try {
                const url = `${fbstatics.prefix}${fbstatics.mobile}/${this.userId}`

                await this.browser.page.goto(url, { waitUntil: 'networkidle0', timeout: this.timeout })
                await this.browser.page.waitForSelector('div#viewport', { waitUntil: 'networkidle0', timeout: this.browser.timeout })

                const user = await this.browser.page.evaluate(() => {
                    return new Promise((resolve, reject) => {
                        try {
                            const numericId = /(?<=entity_id:)\d+(?=[^\d])/.match(document.body.innerHTML)
                            const vanityId = (location.pathname !== '/profile.php') ? location.pathname.replace('/', '') : null
                            const username = document.querySelector('div#cover-name-root').innerText

                            resolve({ id: numericId, vanity: vanityId, name: username})
                        } catch (error) {
                            reject(error)
                        }
                    })
                })

                if (config.debug) console.log(`[${Date()}] Got user data of user ${this.userId}`)
                resolve(user)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @returns 
     */
    getFriends() {
        return new Promise(async (resolve, reject) => {
            try {
                const url = `${fbstatics.prefix}${fbstatics.mobile}/${this.userId}/${fbstatics.friends}`
                
                await this.browser.page.goto(url, { waitUntil: 'networkidle0', timeout: this.timeout })
                await this.browser.page.waitForSelector('div#viewport', { waitUntil: 'networkidle0', timeout: this.browser.timeout })

                const friends = await this.browser.page.evaluate(() => {
                    return new Promise((resolve, reject) => {
                        try {
                            const list = []
                            const task = setInterval(() => {
                                window.scrollBy(0, document.body.scrollHeight)

                                if (!document.getElementById('m_more_friends')) {
                                    clearInterval(task)

                                    const friends = document.querySelectorAll('div#root > div.timeline > div[class] > div')

                                    //if (friends.length == 0) resolve([])

                                    friends.forEach(friend => {
                                        const username = friend.querySelector('h1 > a, h3 > a').innerText
                                        let userid = friend.querySelector('h1 > a, h3 > a').href.replace('https://m.facebook.com/', '').replace('profile.php?id=', '')

                                        if (userid.includes('?')) userid = userid.split('?')[0]
                                        if (userid.includes('&')) userid = userid.split('&')[0]
                                        
                                        list.push({ id: userid, name: username })
                                    })

                                    resolve(list)
                                }
                            }, 250)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })

                if (config.debug) console.log(`[${Date()}] Got friends of user ${this.userId}`)
                resolve(friends)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @returns 
     */
    close() {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.browser.close())
            } catch (error) {
                reject(error)
            }
        })
    }

}