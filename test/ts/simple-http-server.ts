import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as pem from 'pem-promise';
import * as https from 'https';
import * as multer from 'multer';

export async function startHTTPServer(port: number = 443): Promise<any> {
  const keys = await pem.createCertificate({ days: 1, selfSigned: true });
  const app = express();
  app.use(bodyParser.json());

  const upload = multer({ dest: 'uploads/' });
  app.get('/api/test', (req, res) => {
    res.send('req was ok');
  });
  app.post('/api/test', (req, res) => {
    res.status(201).send({ headers: req.headers, body: req.body });
  });
  app.post('/api/longreq', (req, res) => {
    setTimeout(() => res.status(201).send({ headers: req.headers, body: req.body }), 22 * 1000);
  });
  app.post('/a/vvc_test/api/v2/contacts/abc-123456/bot-response', (req, res) => {
    res.send(req.body);
  });
  app.post('/a/vvc_test/api/v2/contacts/abc-123456/bot-attach', upload.single('file'), (req, res) => {
    //console.dir(req.query, { colors: true, depth: 20 });
    res.send({ url: 'https://a.b.c/123456', meta: { mimetype: 'image/jpg', ref: req.query.ref || '' } });
  });

  return new Promise((resolve, reject) => {
    resolve(https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port));
  });
}

//(async () => await startHTTPServer())();
