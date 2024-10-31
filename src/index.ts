import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import express, { Application } from 'express';

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  //   const content = message.body;
  //   const chats = await client.getChats();
  //   console.log(chats);
});

client.initialize();

const sendText = (req: any, res: any) => {
  console.log(req.body);

  let { number, message } = req.body;

  number = number.replace('@c.us', '');
  number = `${number}@c.us`;

  client.sendMessage(number, message);
  client.setDisplayName('..:: Bot ::..');

  res.send({ status: 'Enviado mensagem!' });
};

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/send', sendText);
app.listen(3000, () => console.log('Server listening on 3000..'));
