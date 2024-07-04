import React from 'react'


export const Navbar = () => {
  return (
    <nav className='flex justify-between bg-slate-700 text-white py-2'>
    <div className='logo'>
        <span className='font-bold text-xl mx-9'> Task to do</span>
    </div>
    <ul className='flex gap-8 mx-10'> 
        <li className='cursor-pointer transition-all'>home</li>
        <li className='cursor-pointer transition-all'>Your task</li>
    </ul>
    
    
    </nav>
    
  );
};
export default Navbar;
