import React from 'react';

import './Input.css';

const Input = (props) => {
  const inputEl = <input id={props.id} type={props.type} placeholder={props.placeholder} />;
  const textareaEl = <textarea id={props.id} row={props.row || 3} />;
  const element = props.element === 'input' ? inputEl : textareaEl;

  return (
    <div className={`form-control`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Input;
