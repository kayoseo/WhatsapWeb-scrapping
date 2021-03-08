const puppeteer = require('puppeteer');
const { TIMEOUT } = require('dns');

const xlsxFile = require('read-excel-file/node');



const readline = require("readline"),
  fs = require("fs"),
  NOMBRE_ARCHIVO = "mensaje.txt";

let lector = readline.createInterface({
  input: fs.createReadStream(NOMBRE_ARCHIVO)
});
var saltoLinea = "%0a";
var mensaje = "";
var numeros=[];
var nombres=[];
lector.on("line", linea => {
  mensaje = mensaje + linea + saltoLinea;
});
mensaje = mensaje.replace(" ", "+");

xlsxFile('./voluntarios.xlsx', { sheet: 'Hoja1' }).then((rows) => {
  for (i in rows) {
    for (j in rows[i]) {
      

      if (i != 0) {
        if (j == 0) {
         nombres.push(rows[i][j]);
        }
        if (j == 1) {
        numeros.push(rows[i][j]);
        }

      }
    }
  }
});

(async () => {
  var browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com/', {
    waitUntil: "load"
  })
  await delay(4000);
  


  for(var i=0;i<numeros.length;i++)
  {
    var mensajePersonal=mensaje.replace("NOMBRE",nombres[i]);
    await page.goto('https://web.whatsapp.com/send?phone='+numeros[i]+'&text=' + mensajePersonal, {
      waitUntil: "load"
    });

    await page.waitForSelector('#main > footer > div.vR1LG._3wXwX.copyable-area > div:nth-child(3) > button');
    await delay(1500);
    await page.click('#main > footer > div.vR1LG._3wXwX.copyable-area > div:nth-child(3) > button');
    await delay(2000);  
  }

  
   
   

 

  // other actions...
  await browser.close();
})();



function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}