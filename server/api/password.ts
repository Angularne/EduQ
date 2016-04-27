/** TODO
  Hash password
  random password
 */


export namespace Password {

  export function hash() {

    
  }

  export function random() {
    var password = '';
    let dictionary = 'abcdefghijklmnopqrstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < 8; i++) {
      let random = Math.floor(Math.random() * dictionary.length);
      password += dictionary.charAt(random);
    }
    return password;
  };

}
