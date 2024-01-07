import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import Cookies from 'universal-cookie';
import logo from '../logo.png';
import { Link, useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

function Index (props) {
	const [progress, setProgress] = useState(20);

	const history = useHistory();
	
	function checkAuthToken () {
        const cookies = new Cookies();
		let token = cookies.get('token');
		
		if (token !== undefined) {
			if (token.split('.').length === 3) {
				history.push('/home')
			}
		}
		
		setProgress(100)

        return () => {

        }
	} 
	
	useEffect(checkAuthToken, [history])

	return (
		<div className="flex flex-col items-center">
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<header className="flex flex-row items-center py-[100px]">
				<img src={logo} alt="Meetio Logo" className="w-[80px] sm:w-[50px] h-[80px] sm:h-[50px] mr-4" />
				<p className="text-3xl sm:text-2xl font-bold">Meetio</p>
			</header>
			<main className="flex flex-col">
				<p className="text-2xl sm:text-xl text-center font-bold mb-[50px]">
					Start a relationship.<br />
					Meet People.
				</p>
				<Link to="/signin" className="text-lg sm:text-base font-medium text-pink" style={{ textDecoration: 'none' }}>
					<button className="p-2 my-2 border border-neutral-300 min-w-[200px] rounded-2xl hover:bg-neutral-100">Sign In</button>
				</Link>
				<Link to="/signup" className="text-lg sm:text-base font-medium text-pink" style={{ textDecoration: 'none' }}>
					<button className="p-2 my-2 border border-neutral-300 min-w-[200px] rounded-2xl hover:bg-neutral-100">Sign Up</button>
				</Link>
			</main>
		</div>
	);
}

export default Index;
