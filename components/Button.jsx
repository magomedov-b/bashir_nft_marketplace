import React from 'react'

const Button = ({ btnName, classStyles, handleClick }) => {
  return (
    <button
      type='button'
      className={`nft-gradient text-sm minlg:text-large py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}
      onClick={handleClick}
    >
      {btnName}
    </button>
  )
}

export default Button