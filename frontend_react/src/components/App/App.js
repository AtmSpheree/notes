import '../../css/App.css';
import {Route, Routes} from "react-router";
import About from '../About/About'
import Home from '../Home/Home'
import Login from '../Login/Login'
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

const App = () => {
  const [access, setAccess] = useState(localStorage.getItem('accessToken'));
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'));
  const [refreshRequired, setRefreshRequired] = useState(false);
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(process.env.REACT_APP_HOST)
    if (refresh === null) {
      navigate('/login');
    } else if (refreshRequired) {
      fetch(
        `${process.env.HOST}/api/token/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ refresh })
        }
      ).then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 401) {
          navigate('/login');
          throw Error(`Something went wrong: code ${response.status}`)
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      }).then(({access, refresh}) => {
        localStorage.setItem('accessToken', access)
        setAccess(access)
        localStorage.setItem('refreshToken', refresh)
        setRefresh(refresh)
      }).catch(error => {
        console.log(error.message);
      })
    }}, [refreshRequired])

  useEffect(() => {
    if (error != null) {
      const error_element = document.getElementById("error")
      error_element.append(
        <div className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">
              {error.message}
            </div>
            <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Закрыть"></button>
          </div>
        </div>
      )
    }
  }, [error])

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home access={access} refresh={refresh} setRefreshRequired={setRefreshRequired}
                                       navigate={navigate} setAccess={setAccess} setRefresh={setRefresh}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login setRefresh={setRefresh} setAccess={setAccess}
                                             access={access} navigate={navigate}/>}/>
      </Routes>
      <div id="error" className="toast-container position-absolute top-0 end-0 p-3"></div>
    </div>
  )
}

export default App;
