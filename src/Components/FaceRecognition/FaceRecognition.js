import React from 'react';
import './FaceRecognition.css';
const FaceRecognition = ({imageUrl,box})=>{
	return(
		<div className='center ma'>
			<div className='mt2 absolute'>
			<img id='inputImage' src={imageUrl} alt ='' width='450'  height='auto'/>
			<div className='draw' 
			style={{top:box.topRow ,bottom:box.bottomRow, left:box.leftCol, right:box.rightCol}}></div>
			</div>
		</div>
 	);
}
export default FaceRecognition;