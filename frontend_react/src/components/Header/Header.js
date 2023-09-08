import '../../css/Header.css';
import logo from '../../logo.png'

const Header = () => {
  return (
    <div className="header">
      <div className="header_container">
        <div className="logo_container">
          <img src={logo} alt="logotype"/>
          <a href="/">notes_app</a>
        </div>
      </div>
    </div>
  );
}

export default Header;
