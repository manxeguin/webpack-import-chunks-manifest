import React from 'react';

const onClickHandler = (moduleOption) => {
  if (moduleOption === 'C') {
    import(`./moduleA`).then((module) => {
      console.log({ module });
    });
  } else {
    import(/* webpackChunkName: "moduleB" */ `./moduleB`).then((module) => {
      console.log({ module });
    });
  }
};
const Button = () => (
  <button onClick={() => onClickHandler('C')}> Load Button</button>
);

export default Button;
