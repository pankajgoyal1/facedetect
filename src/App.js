import React, { Component } from 'react';
import './App.css';
import Logo from './Components/Logo';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank';
import SearchBox from './Components/SearchBox';
import Navigation from './Components/Navigation';
import 'tachyons';
import Particles from 'react-particles-js';
import Signin from './Components/Signin.js';
import Register from './Components/Register.js';

const Particle ={ 
	particles: {
		number:{
			value:50,
			density:{
				enable:true,
				value_area:1000
			}
		}
		}
	}
const initialState={
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
			this.setState(initialState);
			this.setState({isSignedIn:false})
		} 
		this.setState({route:route})
	}
	onInputChange =(event)=>{
		this.setState({input:event.target.value})
	}
	onButtonSubmit =()=>{
		this.setState({imageUrl:this.state.input});
	  	fetch('http://localhost:3000/imageurl',{
	   			method:'post',
	   			headers:{'Content-Type':'application/json'},
	   			body:JSON.stringify({
	   				input:this.state.input
	   			})
	   		})
	  .then(response=>response.json())
	  .then(response =>{
	  	console.log(response);
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
	   		.catch(console.log)
	   	}
	   	this.detectFace(this.calculateFaceLocation(response))
	   })
	   .catch(console.log);
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
