import config from "./config.json";

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function isValidToken(access_token) {
  let result = false;
  fetch(
    `${config.host}/api/user`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${access_token}`
      }
    }
  ).then(response => {
    if (response.ok) {
      result = true;
    }
  })
  return result
}