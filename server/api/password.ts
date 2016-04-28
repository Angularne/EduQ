import bcrypt = require('bcrypt');

  export function test() {
    let password = ' ';

    bcrypt.genSalt((err: Error, salt: string) => {
      bcrypt.hash(password, salt, (err: Error, hash) => {

        console.log('salt: ' + salt);
        console.log('hash: ' + hash);



        bcrypt.compare(password, hash, (err: Error, same: boolean) => {
          console.log('same: ' + same);
        })

      });
    });
  }





setTimeout(() => {test()}, 1000);
