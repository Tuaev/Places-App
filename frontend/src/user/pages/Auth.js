import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from '../../shared/util/validators';
import './Auth.css';

const Auth = (props) => {
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  return (
    <div className="authentication">
      <form onSubmit={authSubmitHandler}>
        <Input
          id="email"
          element="input"
          type="email"
          label="Email"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
        />
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(4)]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default Auth;
