import React, { useEffect, useRef, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import Cookies from 'universal-cookie';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/form.css';


function Signin () {
	const cookies = new Cookies();

	const [name, setUsername] = useState(''),
		[password, setPassword] = useState(''),
		[error, setError] = useState(false),
		[progress, setProgress] = useState(20);

	const submitButton = useRef();


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
			<header className="nav-header">
				<Link to="/"><MaterialIcon icon="arrow_back" size={34} /></Link>
			</header>
			<main>
				<header>
					<p>Sign In</p>
				</header>
				<form>
					<input type="name" placeholder="Username" name="name" onChange={event => {setUsername(event.target.value); updateForm()}} />
					<input type="password" placeholder="Password" name="password" onChange={event => {setPassword(event.target.value); updateForm()}} />
					<button ref={submitButton} onClick={submitSignIn}>Send</button>
				</form>
			</main>
			<span className={error ? 'error show' : 'error'}>Incorrect username or password</span>
		</div>
	);
}

export default Signin;
