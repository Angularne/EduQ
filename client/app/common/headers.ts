import {Headers} from "@angular/http";

export function authHeaders() {
  let headers = new Headers();
  let batoken = sessionStorage.getItem("authToken");
  if (batoken) {
    headers.append("Authorization", `Basic ${batoken}`);
  }
  headers.append("Content-Type", "application/json");
  return headers;
}
