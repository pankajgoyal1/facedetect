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
let flag=false;
class App extends Component {
	constructor(){
		super();
		this.state = {
			input:'' ,
			imageUrl:'',
			box:{},
			route:'signin',
			isSignedIn:false,
			user:{
				id:'',
				name:'',
				email:'',
				password:'',
				entries:0,
				joined:''
			}
		}
	}
	loadUser =(data)=>{
		this.setState({user:{
			id:data.id,
			name:data.name,
			email:data.email,
			entries:data.entries,
			joined:data.joined

		}})
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
			this.setState({imageUrl:'',box:{}});
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
	   .then(response =>{
	   	if(response){
	   		fetch('http://localhost:3000/image',{
	   			method:'put',
	   			headers:{'Content-Type':'application/json'},
	   			body:JSON.stringify({
	   				id:this.state.user.id
	   			})
	   		})
	   		.then(response=>response.json())
	   		.then(count=>{
	   			this.setState(Object.assign(this.state.user, {entries:count}));
	   		})
	   	}
	   	flag=true;
	   	this.detectFace(this.calculateFaceLocation(response))
	   })
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
	       <Rank name={this.state.user.name} entries={this.state.user.entries} />
	       <SearchBox
	        onInputChange={this.onInputChange} 
	        onButtonSubmit={this.onButtonSubmit}
	       />
	       <FaceRecognition box={this.state.box} isSignedIn={this.state.isSignedIn} imageUrl={this.state.imageUrl} />
	       
	    </div>
	    :(
	    	this.state.route === 'signin'
	    	? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
	    	: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
	    )
   		
   		
	   } 
       

      </div>
    );
  }
}

export default App;
