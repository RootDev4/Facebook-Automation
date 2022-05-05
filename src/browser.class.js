const puppeteer = require('puppeteer')

/**
 * 
 */
module.exports = class Browser {
    
    /**
     * 
     * @param {*} debug 
     */
    constructor(debug = false) {
        this.debug = debug
        this.browser = null
        this.page = null
        this.headless = true
        this.options = []
        this.userAgent = null
        this.timeout = 0
        this.proxy = null
    }

    /**
     * 
     * @returns 
     */
    setVisible() {
        this.headless = false
        if (this.debug) console.log(`[${Date()}] Browser is visible`)

        return this
    }

    /**
     * 
     * @param {*} options 
     * @returns 
     */
    setOptions(options = []) {
        this.options = options
        if (this.debug) console.log(`[${Date()}] Set browser options to: ${options.toString()}`)

        return this
    }

    /**
     * 
     * @param {*} userAgentString 
     * @returns 
     */
    setUserAgent(userAgentString) {
        this.userAgent = userAgentString
        if (this.debug) console.log(`[${Date()}] Set browser user agent to: ${userAgentString}`)

        return this
    }

    /**
     * 
     * @param {*} timeoutInMilliSeconds 
     * @returns 
     */
    setTimeout(timeoutInMilliSeconds) {
        this.timeout = timeoutInMilliSeconds
        if (this.debug) console.log(`[${Date()}] Set browser timeout to: ${timeoutInMilliSeconds}ms`)

        return this
    }

    /**
     * 
     * @param {*} proxyString 
     * @returns 
     */
    setProxy(proxyString) {
        this.proxy = this.options.push(`--proxy-server=${proxyString}`)
        if (this.debug) console.log(`[${Date()}] Set browser proxy to: ${proxyString}`)

        return this
    }


    /**
     * 
     * @returns 
     */
    launch() {
        return new Promise(async (resolve, reject) => {
            try {
                this.browser = await puppeteer.launch({ headless: this.headless, args: this.options })
                this.page = await this.browser.newPage()

                if (this.userAgent) await this.page.setUserAgent(this.userAgent)
                if (this.debug) console.log(`[${Date()}] Browser instance started successfully`)

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @param {*} url 
     * @returns 
     */
    get(url) {
        return new Promise(async (resolve, reject) => {
            try {
                // Open URL
                await this.page.goto(url, { waitUntil: 'networkidle0', timeout: this.timeout })

                // Get HTML content
                const content = await this.page.content()
                if (!content) throw new Error(`Can't get resource of ${url}`)
                if (this.debug) console.log(`[${Date()}] Content of ${url} successfully scraped`)

                resolve(content)
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
                if (this.debug) console.log(`[${Date()}] Running browser closed by user`)
                resolve(await this.browser.close())
            } catch (error) {
                reject(error)
            }
        })
    }

}