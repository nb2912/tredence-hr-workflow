const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Handle the confirm dialog automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  console.log('Selecting template...');
  await page.select('select', 'Onboarding');
  
  console.log('Waiting a bit for template to load...');
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Clicking Run Simulation...');
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await page.evaluate(el => el.textContent, button);
    if (text && text.includes('Run Simulation')) {
      await button.click();
      console.log('Clicked!');
      break;
    }
  }
  
  console.log('Waiting 5 seconds for simulation and errors...');
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
