import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = (props) => {
  const formSubmit = (e) => {
    if (props.onSubmit) return props.onSubmit;
    e.preventDefault();
  };
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.header}`}>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={formSubmit}>
        <div className={`modal__content ${props.contentClass}`}>{props.children}</div>
        <footer className={`modal__footer ${props.footerClass}`}>{props.footer}</footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
