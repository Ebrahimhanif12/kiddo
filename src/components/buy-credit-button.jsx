import React from 'react';
const BuyCreditButton = (props) => {
    <button onClick={props.onClick} type="submit" className={props.className}>{props.text}</button>
    
};
export default BuyCreditButton;