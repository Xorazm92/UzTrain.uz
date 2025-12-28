import React, { useContext, useState } from 'react';
import { store } from "../../App";
import './InputField.scss';
import Refresh from '../../resources/images/refresh.png';
const InputFields = () => {
  const [newCity, setNewCity] = useState('');

  const [_state, dispatch] = useContext(store);

  const changeCity = (e:  React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setNewCity('');
    
    dispatch({ type: 'city/CHANGE', payload: newCity });
  };
  
  return (
    <form className='input-container' onSubmit={changeCity}>

      <input
        type='text'
        id='input'
        className='input-field'
        placeholder='Your City'
        value={newCity}
        onChange={(e) => setNewCity(e.target.value)}
      />
      <img
        src={Refresh}
        alt="Refresh"
        className="refresh-icon"
      />
    </form>



  )
}

export default InputFields
