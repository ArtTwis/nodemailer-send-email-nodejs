const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const expHandlebars = require('express-handlebars').engine;

const nodemailer = require('nodemailer');

const path = require('path');

// View engine setup
app.engine('handlebars', expHandlebars());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body-Parser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have new contact request</p>
    <h3>Contact Details :</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '*****@****.***', // generated ethereal user
      pass: '***********', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <twinklegoyal786@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: req.body.message, // plain text body
    html: output, // html bodyRECEIVEREMAILS
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', { msg: 'Email has been sent' });
  });
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080....');
});
