import React, { Component } from 'react';
import './App.css';
import Logo from './Components/Logo';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import Clarifai from 'clarifai';
import Rank from './Components/Rank';
import SearchBox from './Components/SearchBox';
import Navigation from './Components/Navigation';
import 'tachyons';
import Particles from 'react-particles-js';
import Signin from './Components/Signin.js';
import Register from './Components/Register.js';

const app = new Clarifai.App({
 apiKey: '17c4369faa394932aff6e35ae8dfe073'
});
const Particle ={ 
	particles: {
		number:{
			value:30,
			density:{
				enable:true,
				value_area:800
			}
		}
		}
	}   
class App extends Component {
	constructor(){
		super();
		this.state = {
			input:'' ,
			imageUrl:'',
			box:{},
			route:'signin',
			isSignedIn:false
		}
	}
	calculateFaceLocation =(data)=>{
		const clarifai = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image=document.getElementById('inputImage');
		const width=Number(image.width);
		const height=Number(image.height);
		return{
			leftCol:clarifai.left_col * width,
			topRow:clarifai.top_row * height,
			rightCol:width-(width * clarifai.right_col),
			bottomRow: height-(clarifai.bottom_row * height)
		}
	}
	detectFace =(box)=>{
		console.log(box);
		this.setState({box:box})

	}
	onRouteChange = (route)=>{
		if(route === 'home'){
			this.setState({isSignedIn:true})
		}
		else{
			this.setState({isSignedIn:false})
		}
		this.setState({route:route})
	}
	onInputChange =(event)=>{
		this.setState({input:event.target.value})
	}
	onButtonSubmit =()=>{
		this.setState({imageUrl:this.state.input});
	  	app.models.predict(
		Clarifai.FACE_DETECT_MODEL,
		this.state.input)
	   .then(response =>this.detectFace(this.calculateFaceLocation(response)))
	   .catch(err=> console.log(err));
	}
    render() {
    return (
      <div className="App">
       <Particles className='particles'
        params={Particle} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
       {this.state.route === 'home'
   		? <div>
	       <Logo />
	       <Rank />
	       <SearchBox
	        onInputChange={this.onInputChange} 
	        onButtonSubmit={this.onButtonSubmit}
	       />
	       <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
	    </div>
	    :(
	    	this.state.route === 'signin'
	    	? <Signin onRouteChange={this.onRouteChange} />
	    	: <Register onRouteChange={this.onRouteChange} />
	    )
   		
   		
	   }  

       

      </div>
    );
  }
}

export default App;
