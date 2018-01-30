import config from 'config'
import logger from 'utils/logger'
import puppeteer from 'puppeteer'

export default async function uploadVideosToYouTube(arrayOfVideos) {

  logger.info('Starting upload to YouTube.')

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()

    logger.info('Browser has launched.')

    await page.goto('https://www.youtube.com/signin')

    // Type email
    await page.click('input[type=email]')
    await page.keyboard.type(config.YOUTUBE.credentials.email)

    // Locate email submit button
    let EMAIL_BUTTON = 'input[type=submit]'
    if (!(await page.$('input[type=submit]'))) {
      EMAIL_BUTTON = '#identifierNext'
    }

    // Click email submit button
    await page.click(EMAIL_BUTTON)

    // Type password
    await page.waitFor('input[type=password]', { visible: true })
    await page.click('input[type=password]')
    await page.keyboard.type(config.YOUTUBE.credentials.password)

    // Location password submit button
    let PASSWORD_BUTTON = 'input[type=submit]'
    if (!(await page.$('input[type=submit]'))) {
      PASSWORD_BUTTON = '#passwordNext'
    }

    // Click password submit button
    await page.click(PASSWORD_BUTTON)
    await page.waitForNavigation()

    logger.info('Successfully signed into YouTube.')

    // Switch YouTube channels
    await page.goto(config.YOUTUBE.switchChannelUrl)

    // Go to upload page
    await page.goto('https://www.youtube.com/upload?next=/')

    // Wait for form to initialise
    await page.waitForSelector('input[type=file]')

    // Select upload field
    const uploader = await page.$('input[type=file]')

    // Upload file
    await uploader.uploadFile(`${process.env.PWD}/${arrayOfVideos[0].path}`)

    logger.info('Upload in progress.')

    await page.waitFor('.save-changes-button', { visible: true, timeout: 0 })
    await page.click('.save-changes-button')

    await page.waitForFunction(
      () => document.querySelector('.progress-bar-uploading').getAttribute('aria-valuenow') === '100',
      { timeout: 0 })

    logger.info('Successfully uploaded.')

    // Wait for a few seconds (safety check)
    await page.waitFor(15000)

    await browser.close()

  } catch (error) {

    logger.error(error)
    throw new Error(error)

  }

}
