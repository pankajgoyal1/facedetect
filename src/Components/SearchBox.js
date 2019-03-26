import React from 'react';
import './SearchBox.css';
const SearchBox =({onInputChange,onButtonSubmit})=>{
	 return(
		<div>
		  <p className='f3'>
			{'This Magic brain will detect faces.Give it a try'}
		  </p>
		  <div className='f3 center'>
		   <div className='br2 form center pa4 shadow-2'>
			<input 
			className='f4 pa2 center w-70 white dib' 
			type="text"
			onChange={onInputChange}
			 />
			<button
			 className='w-30 pv2 ph3 grow link bg-light-purple'
			 onClick ={onButtonSubmit}>
			 Detect</button>
		   </div>
		  </div>
		</div>
	 );
}
export default SearchBox;