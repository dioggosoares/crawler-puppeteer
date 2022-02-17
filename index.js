const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.designerd.com.br/author/admin/', {
    waitUntil: 'networkidle0'
  });

  const imgList = await page.evaluate(() => {
    // essa função executa no browser

    // pegar todas as imagens que estão na parte dos posts
    const nodeList = document.querySelectorAll('.g1-collection ul li article img')

    // tranformar o NodeList em array
    const imgArray = [...nodeList]

    // transformar os nodes (elementos html) em objetos JS
    const imgList = imgArray.map( ({ src }) => ({
      src
    }))

    // colocar para fora da função
    return imgList
  })

  // salvar os dados no pdf
  const pdf = await page.pdf({
    path: "./pdf/relatorio.pdf",
    format: 'a4',
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "40px",
      left: "20px",
      right: "20px",
    }
  })

  // salvar os dados em um arquivo local (json)
  fs.writeFile('./json/designerd.json', JSON.stringify(imgList, null, 2), err => {

    if(err) throw new Error('Alguma coisa está errada')

  })

  await browser.close();

})();
