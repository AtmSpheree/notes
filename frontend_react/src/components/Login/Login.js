import '../../css/Login.css';
import {useState} from "react";
import {isValidToken} from '../../utils';

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [isAccess, setIsAccess] = useState(true);
  const [ifRedirect, setIfRedirect] = useState(true);
  if (ifRedirect) {
    setIfRedirect(false);
    if (isValidToken(props.access)) {
      props.navigate('/');
    }
  }

  const submitHandler = e => {
    e.preventDefault();
    setLoading(true);
    setIsAccess(true);
    fetch(
      `${process.env.REACT_APP_HOST}/api/token/obtain`,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          username: formUsername,
          password: formPassword,
        })
      }
    ).then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 401) {
          throw Error("Unauthorized");
        } else {
          throw Error(`Something went wrong: code ${response.status}`);
        }
      }
    ).then(({access, refresh}) => {
      localStorage.setItem('accessToken', access);
      props.setAccess(access);
      localStorage.setItem('refreshToken', refresh);
      props.setRefresh(refresh);
      props.navigate('/')
    }).catch(error => {
      setLoading(false);
      if (error.message === "Unauthorized") {
        setIsAccess(false);
      }
      console.log(error);
    })
  }

  return (
    <div>
      {
        loading? "Загрузка..." :
          <form className="loginForm" onSubmit={submitHandler}>
            <input type="text" name="username" value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="Username"/>
            <input type="password" name="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Password"/>
            <input type="submit" name="submit" value="Войти"/>
          </form>
      }
      {!isAccess? <div>Неверный логин или пароль</div> : <div></div>}
    </div>);
}

export default Login;
