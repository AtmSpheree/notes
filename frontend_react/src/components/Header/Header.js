import '../../css/Header.css';
import '../../css/Header_adaptive.css';
import logo from '../../img/logo.png'
import github_mark from '../../img/github-mark-white.png'

const Header = () => {
  return (
    <div className="header">
      <div className="header_container">
        <div className="logo_container">
          <img src={logo} alt="logotype"/>
          <a href="/">notes_app</a>
        </div>
        <a className="github_button" rel="noopener noreferrer" target="_blank" href="https://github.com/AtmSpheree/notes">
          <img src={github_mark} alt={"GitHub"}/>
        </a>
      </div>
    </div>
  );
}

export default Header;
