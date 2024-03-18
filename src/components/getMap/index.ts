/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer'

async function waitForSelectorWithDelay(page, selector) {
  const timeout = 500 // 0.5 segundos
  await page.waitForSelector(selector, { timeout })
  await new Promise((resolve) => setTimeout(resolve, timeout))
}

async function clickOnReviewsButton(page) {
  const selector = 'button[jslog^="145620"]'
  await waitForSelectorWithDelay(page, selector)
  await page.click(selector)
}

async function clickOnOrganizeButton(page) {
  const selector = 'button[jslog^="59550"]'
  await waitForSelectorWithDelay(page, selector)
  await page.click(selector)
}

async function clickOnNewestButton(page) {
  const selector = 'div[vet^="25740"]'
  await waitForSelectorWithDelay(page, selector)
  await page.click(selector)
}

async function scrollReviews(page) {
  const selector = 'div[jslog^="26354"]'
  await waitForSelectorWithDelay(page, selector)
  await page.evaluate(() => {
    const reviews = document.querySelector('div[jslog^="26354"]')
    if (reviews) reviews.scrollTo(0, 500)
  })
}

interface IMap {
  id: string
  name: string
  link: string
}

export async function getMap(url: string): Promise<IMap | null> {
  const requests: any[] = []

  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setViewport({
      width: 900,
      height: 1800,
    })
    await page.goto(url)

    page.on('request', (request) => {
      requests.push(request.url())
    })

    await clickOnReviewsButton(page)
    await clickOnOrganizeButton(page)
    await clickOnNewestButton(page)
    await scrollReviews(page)
    await scrollReviews(page)
    await scrollReviews(page)

    // await browser.close()
    const request = requests.find((url) =>
      url.startsWith('https://www.google.com/maps/rpc/listugcposts'),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // const businessItem: { id: string; name: string } = { id: '', name: '' }

    const appInitializationState = await page.evaluate(() => {
      // Aqui acessamos a variável "APP_INITIALIZATION_STATE" no contexto da página
      return window['APP_INITIALIZATION_STATE']
    })

    const business = appInitializationState[5][3][2]

    const id = business[0]
    const name = business[1]

    console.log('APP_INITIALIZATION_STATE:', { id, name, link: request })

    return { id, name, link: request }
  } catch (error) {
    console.error('Ocorreu um erro:', error)
    return null
  }
}
