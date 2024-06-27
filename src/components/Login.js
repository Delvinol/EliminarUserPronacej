import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logopronacej from '../assets/logopronacej.png';
import './css/Login.css';

const MySwal = withReactContent(Swal);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      MySwal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Todos los campos son obligatorios'
      });
      return;
    }

    const loginUrl = 'http://181.176.172.117:8081/api/v1/auth/authenticate';
    const payload = { email: email.trim(), password: password.trim() };

    try {
      const response = await axios.post(loginUrl, payload);
      const { id, token, name, lastName } = response.data;

      MySwal.fire({
        title: 'Advertencia',
        text: `¿Estás seguro que quieres eliminar tu cuenta, ${name} ${lastName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const deleteUrl = `http://181.176.172.117:8081/api/v1/auth/delete/${id}`;
          try {
            await axios.delete(deleteUrl, {
              headers: { Authorization: `Bearer ${token}` }
            });
            MySwal.fire({
              icon: 'success',
              title: 'Cuenta Eliminada',
              text: 'Tu cuenta ha sido eliminada exitosamente'
            });
          } catch (error) {
            MySwal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar tu cuenta'
            });
            console.log(error);
          }
        }
      });

    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en el inicio de sesión. Verifique sus credenciales'
      });
      console.log(error);
    }
  };

  return (
    <section>
      <div className="wrapper">
        <div className="logo">
          <img src={logopronacej} alt="Logotipo Pronacej" />
        </div>
        <div className="text-right mt-5 name">Eliminar Cuenta</div>
        <form className="p-3 mt-3" onSubmit={handleDeleteAccount}>
          <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input
              type="email"
              name="userName"
              id="userName"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input
              type="password"
              name="password"
              id="pwd"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn mt-3" type="submit">Eliminar Cuenta</button>
        </form>
      </div>
      <div className='wave wave1'></div>
      <div className='wave wave2'></div>
      <div className='wave wave3'></div>
      <div className='wave wave4'></div>
    </section>
  );
};

export default Login;
