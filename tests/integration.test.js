const request = require('supertest');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { sampleHtmlWithYale } = require('./test-utils');
const nock = require('nock');

// Create a test app (replicating app.js logic without starting a server)
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.post('/fetch', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const response = await axios.get(url);
      const html = response.data;

      const $ = cheerio.load(html);
      
      $('body *').contents().filter(function() {
        return this.nodeType === 3;
      }).each(function() {
        const text = $(this).text();
        const newText = text.replace(/Yale/g, 'Fale').replace(/yale/g, 'fale');
        if (text !== newText) {
          $(this).replaceWith(newText);
        }
      });
      
      const title = $('title').text().replace(/Yale/g, 'Fale').replace(/yale/g, 'fale');
      $('title').text(title);
      
      return res.json({ 
        success: true, 
        content: $.html(),
        title: title,
        originalUrl: url
      });
    } catch (error) {
      return res.status(500).json({ 
        error: `Failed to fetch content: ${error.message}` 
      });
    }
  });
  
  return app;
}

describe('Integration Tests', () => {
  let app;

  beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
    app = createTestApp();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('Should replace Yale with Fale in fetched content', async () => {
    nock('https://example.com')
      .get('/')
      .reply(200, sampleHtmlWithYale);
    
    const response = await request(app)
      .post('/fetch')
      .send({ url: 'https://example.com/' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    
    const $ = cheerio.load(response.body.content);
    expect($('title').text()).toBe('Fale University Test Page');
    expect($('h1').text()).toBe('Welcome to Fale University');
    expect($('p').first().text()).toContain('Fale University is a private');
    
    const links = $('a');
    let hasYaleUrl = false;
    links.each((i, link) => {
      const href = $(link).attr('href');
      if (href && href.includes('yale.edu')) {
        hasYaleUrl = true;
      }
    });
    expect(hasYaleUrl).toBe(true);
    expect($('a').first().text()).toBe('About Fale');
  });

  test('Should handle invalid URLs', async () => {
    const response = await request(app)
      .post('/fetch')
      .send({ url: 'not-a-valid-url' })
      .expect(500);
    
    expect(response.body.error).toContain('Failed to fetch content');
  });

  test('Should handle missing URL parameter', async () => {
    const response = await request(app)
      .post('/fetch')
      .send({})
      .expect(400);
    
    expect(response.body.error).toBe('URL is required');
  });
});
