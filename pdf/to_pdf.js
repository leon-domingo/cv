(async () => {
  const args      = require('args')
  const puppeteer = require('puppeteer')


  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  args
    .option('html', 'The absolute path of the HTML file (input)')
    .option('url', 'The URL of the web page (input)')
    .option('pdf', 'The absolute path of the PDF file (output)')

  const flags = args.parse(process.argv)

  await page.emulateMedia('screen')
  await page.goto(
    flags.url || `file://${flags.html}`,
    { waitUntil: 'networkidle2' }
  )

  const height = await page.evaluate(() => document.documentElement.scrollHeight);

  await page.pdf({
    path: flags.pdf,
    width: '1280px',
    height: (height - 200) + 'px',
    printBackground: true,
  })

  await browser.close()
})();
