import nodemailer = require('nodemailer');

let smtp = require('../../config').smtp;

let defaults = {
  from:  `"${smtp.name}" ${smtp.auth.user}`
}


var transporter = nodemailer.createTransport(smtp, defaults);


export namespace Mail {
  export function test() {
    var options = {
      //from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
      to: 'achrs@hotmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      html: '<b>Hello world 🐴</b><br><i>Denne eposten er sendt fra node</i>' // html body
    };
    transporter.sendMail(options, (err, info) => {
      if (!err) {
        console.log(info);
      } else {
        console.error(err);
      }
    });
  }


  export function newUser(email: string, password: string) {
    let options = {
      to: email,
      subject: 'Ny bruker opprettet',
      html: `
        <b> Ny bruker registert </b>
        <br>
        <br>
        <b>Brukernavn:</b> ${email}
        <br>
        <b>Passord:</b> ${password}
        <br>
        <br>
        <br>
        Hilsen ${smtp.name}
      `
    };

    transporter.sendMail(options, (err, info) => {
      if (!err) {
        console.log(info);
      } else {
        console.error(err);
      }
    });
  }

  export function forgotpassword(email: string, password: string) {
    let options = {
      to: email,
      subject: 'Nytt passord',
      html: `
        <b> Nytt passord </b>
        <br>
        <b>Ditt nye passord er:</b> ${password}
        <br>
        <br>
        Hilsen ${smtp.name}
      `
    };

    console.log(options);

    transporter.sendMail(options, (err, info) => {
      if (!err) {
        console.log(info);
      } else {
        console.error(err);
      }
    });
  }
}
