import { useEffect, useState } from "react";
import { Link } from "react-router";
import { showNotification } from "../../utils";
import { useBarcodeScanner } from "../../utils/barcodeDetection";
import { getCityName } from "../../utils/geolocation";
import { startBackgroundFetch } from "../../utils/backgroundFetchApi";
import './style.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { codes, startBarcodeScanner } = useBarcodeScanner();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [location, setLocation] = useState({});
  const [city, setCity] = useState('');
  
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          getCityName(position.coords.latitude, position.coords.longitude)
            .then(data => setCity(data.display_name));
      },
      (error) => error,
    )}
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
      <button type="button" className="scan" onClick={startBarcodeScanner}>Сканировать qr код</button>
      {/* <Link to='/custom-scanner'>Scan qr with library</Link> */}
      <div>
        <h3>Найденные QR-коды:</h3>
        {codes.length > 0 ? (
          codes.map((code, index) => <p key={index}>{code.rawValue}</p>)
        ) : (
          <p>Нет данных</p>
        )}
      </div>
      <div>Ваше местоположение:
        <div>{location?.coords?.latitude || '-'}</div>
        <div>{location?.coords?.longitude || '-'}</div>
        <div>Город: {city}</div>
      </div>
      <button type="button" onClick={() => startBackgroundFetch('https://nbg1-speed.hetzner.com/100MB.bin')}>Скачать файл</button>
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
