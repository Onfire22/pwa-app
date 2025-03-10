import { Route, Routes } from 'react-router';
import Users from './pages/main/Users';
import Profile from './pages/profile/Profile';
import './App.css';

function App() {

  return (
    <Routes>
      <Route index element={<Users />} />
      <Route path='/profile' element={<Profile />} />
    </Routes>
  );
}

export default App;
