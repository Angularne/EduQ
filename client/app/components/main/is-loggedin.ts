// is-loggedin.ts
export function isLoggedin() {
  return !!localStorage.getItem('token');
}
