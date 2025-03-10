import { useEffect, useState } from "react";
import { Link } from "react-router";
import { showNotification } from "../../utils";
import './style.css';
import { useBarcodeScanner } from "../../utils/barcodeDetection";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { codes, startBarcodeScanner } = useBarcodeScanner();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(data => data.json())
      .then(users => {
        setUsers(users);
      })
      // .then(() => showNotification('Успешно', 'Список успешно загружен', '/icons/mail.svg'))
      .catch(() => showNotification('Ошибка', 'Список не загружен, произошла ошибка', '/icons/error.svg'))
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Результат установки: ${outcome}`);
      setDeferredPrompt(null);
      setShowButton(false);
    }
  };

  return (
    <>
      <Link to='/profile'>Мой профиль</Link>
      {showButton && <button onClick={handleInstallClick}>Установить</button>}
      <button type="button" onClick={startBarcodeScanner}>Сканировать qr код</button>
      <div>
        <div>Коды:</div>
        {codes.map((code) => {
          return <div>{code}</div>
        })}
      </div>
      <div className="container">
        {users.map(({ id, name, phone, username, email }) => {
          return (
            <div className="user" key={id}>
              <p className="user_info">ФИО: {name}</p>
              <p className="user_info">Телефон: {phone}</p>
              <p className="user_info">Имя: {username}</p>
              <p className="user_info">Почта: {email}</p>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default Users;
