import '../../css/LogoutButton.css';
import {useState} from "react";


const LogoutButton = (props) => {
  const clickHandler = e => {
    e.preventDefault();
    fetch(
      `${process.env.REACT_APP_HOST}/api/token/blacklist`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          refresh: props.refresh
        })
      }
    ).then(response => {
      if (!response.ok) {
        throw Error(`Something went wrong: code ${response.status}, ${response.body}`);
      }
    }).catch(error => {
      console.log(error);
    })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    props.setAccess(localStorage.getItem('accessToken'));
    props.setRefresh(localStorage.getItem('refreshToken'));
    props.navigate("/login")
  }

  return <button name="logout_button" onClick={clickHandler}>Logout</button>
}

export default LogoutButton;