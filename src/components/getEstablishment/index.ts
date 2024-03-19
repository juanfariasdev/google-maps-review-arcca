import puppeteer, { Page } from 'puppeteer'
import { getReviewsByUrl } from '../getReviews'

async function waitForSelectorWithDelay(
  page: Page,
  selector: string,
  timeout: number = 1000,
) {
  try {
    await page.waitForSelector(selector, { timeout })
    await new Promise((resolve) => setTimeout(resolve, timeout)) // Aguarda um tempo adicional após o carregamento do seletor
  } catch (error) {
    throw new Error(`Timeout ao aguardar o seletor: ${selector}`)
  }
}

async function clickAndWait(page: Page, selector: string) {
  await waitForSelectorWithDelay(page, selector)
  await page.click(selector)
}

async function scrollReviews(page: Page) {
  const selector = 'div[jslog^="26354"]'
  await waitForSelectorWithDelay(page, selector)
  await page.evaluate(() => {
    const reviews = document.querySelector('div[jslog^="26354"]')
    if (reviews) reviews.scrollTo(0, 5000)
  })
}

interface IMap {
  id: string
  name: string
  link: string | null
}

export async function getEstablishment(url: string): Promise<IMap | null> {
  try {
    console.log('Iniciou a procura do estabelecimento pelo link: ', url)
    let urlLink: string | null = null
    const urlLinks: string[] = []
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 900, height: 1800 })
    await page.goto(url)
    await page.waitForNavigation()

    page.on('response', async (response) => {
      const urlResponse = response.url()
      urlLinks.push(urlResponse)
    })

    await clickAndWait(page, 'button[jslog^="145620"]')
    await page.waitForNavigation()
    await clickAndWait(page, 'button[jslog^="59550"]')
    await clickAndWait(page, 'div[vet^="25740"]')
    await page.waitForNavigation()

    await scrollReviews(page)
    await scrollReviews(page)
    await scrollReviews(page)

    const appInitializationState = await page.evaluate(
      // eslint-disable-next-line dot-notation
      () => window['APP_INITIALIZATION_STATE'],
    )
    const business = appInitializationState?.[5]?.[3]?.[2]
    const id = business?.[0] ?? ''
    const name = business?.[1] ?? ''

    console.log('APP_INITIALIZATION_STATE:', { id, name })

    await browser.close()

    for (const link of urlLinks) {
      if (link.includes('listugcposts')) {
        const { reviews } = await getReviewsByUrl(link)
        if (reviews && reviews.length > 0) {
          console.log(link)
          urlLink = link

          break
        }
      }
    }

    const establishment = { id, name, link: urlLink }

    console.log(establishment)

    return establishment
  } catch (error) {
    console.error('Ocorreu um erro:', error)
    return null
  }
}
