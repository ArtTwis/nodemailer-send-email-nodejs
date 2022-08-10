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
  console.log('req.body :', req.body);
  const output = `
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'twinklegoyal786@gmail.com', // generated ethereal user
      pass: 'gfhiqquegrpmxbox', // generated ethereal password
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

    return res.render('contact', { msg: 'Email has been sent' });
  });
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080....');
});
