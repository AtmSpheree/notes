import '../../css/Home.css';
import Header from '../Header/Header';
import LogoutButton from '../Login/LogoutButton'
import {useEffect, useState} from "react";

const Home = (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (props.access) {
      fetch(
        `${process.env.REACT_APP_HOST}/api/user`,
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${props.access}`
          }
        }
      ).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          if (response.status === 401) {
            throw Error('refresh')
          }
          throw Error(`Something went wrong: code ${response.status}`)
        }
      }).then(({data}) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
        setEmail(data.email);
      }).catch(error => {
        if (error.message === 'refresh') {
          props.setRefreshRequired(true)
        } else {
          console.log(error)
        }
      })
    } else {
      props.setRefreshRequired(true)
    }
  }, [props.access])

  return (
    <div>
      <Header />
      <div>
        <p>{firstName}</p>
        <p>{lastName}</p>
        <p>{username}</p>
        <p>{email}</p>
        <LogoutButton setAccess={props.setAccess} setRefresh={props.setRefresh} navigate={props.navigate}
                      access={props.access} refresh={props.refresh}/>
      </div>
    </div>
  );
}

export default Home;
