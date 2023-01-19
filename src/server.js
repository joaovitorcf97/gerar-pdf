import express from "express";
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from "puppeteer";

const app = express();

const passengers = [
  {
    name: 'João',
    flightNumber: 7777,
    time: "18h00",
  },
  {
    name: 'Ana',
    flightNumber: 9999,
    time: "19h30",
  },
  {
    name: 'Lucas',
    flightNumber: 8888,
    time: "14h40",
  },
  {
    name: 'Gabriel',
    flightNumber: 2222,
    time: "17h25",
  },
  {
    name: 'Maria',
    flightNumber: 4444,
    time: "18h00",
  }
];

app.get('/pdf', async (request, response) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle0',
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: 'A4',
    // margin: {
    //   top: '140px',
    //   bottom: '140px',
    //   left: '140px',
    //   right: '140px',
    // }
  });

  await browser.close();

  response.contentType('application/pdf');

  return response.send(pdf);
});

app.get('/', (request, response) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, 'print.ejs');

  ejs.renderFile(filePath, { passengers }, (error, html) => {
    if (error) {
      return response.send('Erro na leitura do arquivo');
    }

    return response.send(html);

  });
});

app.listen(3000);