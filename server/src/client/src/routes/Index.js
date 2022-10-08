import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import logo from '../logo.png';
import { Link, useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/index.css';

function Index (props) {
	const cookies = new Cookies();

	let [progress, setProgress] = useState(20);

	let history = useHistory();
	
	function checkAuthToken () {
		let token = cookies.get('token');
		
		if (token !== undefined) {
			if (token.split('.').length === 3) {
				history.push('/home')
			}
		}
		
		setProgress(100)
	} 
	
	useEffect(checkAuthToken, [])

	return (
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => setProgress(0)} />
			<header className="app-header">
				<img src={logo} alt="Meetio Logo" width="80px" height="80px" />
				<p>Meetio</p>
			</header>
			<main>
				<p>
					Start a relationship.<br />
					Meet People.
				</p>
				<Link to="/signin"><button>Sign In</button></Link>
				<Link to="/signup"><button>Sign Up</button></Link>
			</main>
		</div>
	);
}

export default Index;
