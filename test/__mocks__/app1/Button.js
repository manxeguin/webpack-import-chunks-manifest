import React from 'react';

const onClickHandler = (moduleOption) => {
  console.log('clicking button 2');
  import(/* webpackChunkName: "[request]" */ `./module${moduleOption}`).then(
    (module) => {
      console.log('module C loaded');
      console.log({ module });
    }
  );
};
const Button = () => (
  <button onClick={() => onClickHandler('C')}> App 2 Button</button>
);

export default Button;
