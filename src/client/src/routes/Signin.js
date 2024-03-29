import React, { useEffect, useRef, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import Cookies from 'universal-cookie';
import LoadingBar from 'react-top-loading-bar';


function Signin () {
	const cookies = new Cookies();

	const [name, setUsername] = useState(''),
		[password, setPassword] = useState(''),
		[error, setError] = useState(false),
		[progress, setProgress] = useState(20);

	const submitButton = useRef();


	const history = useHistory();


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


	function updateForm () {
		if (name.length > 3 && password.length > 7) {
			submitButton.current.disabled = false;
		} else {
			submitButton.current.disabled = true;
		}
	}


	function submitSignIn (event) {
		event.preventDefault()

		fetch('/api/signin', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				password: password
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			if (res.status === 200 && cookies.get('token') !== undefined) {
				history.push('/home')
			} else {
				setError(true)
			}
		})
	}

	useEffect(updateForm, [name, password])

	return(
		<div>
			<LoadingBar color="#ff005c" progress={progress} onLoaderFinished={() => loaderFinished(setProgress)} />
			<header className="px-5 py-3">
				<Link to="/"><MaterialIcon icon="arrow_back" size={32} /></Link>
			</header>
			<main className="flex flex-col items-center">
				<header>
					<p className="text-2xl sm:text-xl font-bold">Sign In</p>
				</header>
				<form className="flex flex-col w-full p-6 max-w-md">
					<input className="my-5 p-1 w-full border-b border-black text-lg sm:text-base font-sans" type="name" placeholder="Username" name="name" onChange={event => {setUsername(event.target.value); updateForm()}} />
					<input className="my-5 p-1 w-full border-b border-black text-lg sm:text-base font-sans" type="password" placeholder="Password" name="password" onChange={event => {setPassword(event.target.value); updateForm()}} />
					<button className="p-2 my-2 border border-neutral-300 min-w-[200px] rounded-2xl text-lg sm:text-base font-medium text-pink disabled:bg-neutral-300 disabled:text-neutral-500 hover:bg-neutral-100" ref={submitButton} onClick={submitSignIn}>Send</button>
				</form>
			</main>
			<span className="w-full p-5 bg-red-500 text-white fixed max-w-md left-1/2 -translate-x-1/2" style={ error ? { bottom: '0%' } : { bottom: '-100%' } }>Incorrect username or password</span>
		</div>
	);
}

export default Signin;
