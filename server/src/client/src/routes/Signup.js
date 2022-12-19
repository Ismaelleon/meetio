import React, { useEffect, useState } from 'react';
import { loaderFinished } from '../utils/index';
import { Link, useHistory } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import LoadingBar from 'react-top-loading-bar';
import './stylesheets/form.css';
import Cookies from 'universal-cookie';


function Signup (props) {
	const cookies = new Cookies();

	let [name, setUsername] = useState('');
	let [password, setPassword] = useState('');
	let [error, setError] = useState(false);

	const submitButton = React.createRef();

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


	function updateForm () {
		if (name.length > 3 && password.length > 7) {
			submitButton.current.disabled = false;
		} else {
			submitButton.current.disabled = true;
		}
	}

	function submitSignUp (event) {
		event.preventDefault()

		fetch('/api/signup', {
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
				history.push('/signup-details')
			} else if (res.status === 409) {
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
					<p>Sign Up</p>
				</header>
				<form>
					<input type="name" placeholder="Username" name="name" onKeyUp={event => {setUsername(event.target.value); updateForm()}} />
					<input type="password" placeholder="Password" name="password" onKeyUp={event => {setPassword(event.target.value); updateForm()}} />
					<button ref={submitButton} onClick={submitSignUp}>Send</button>
				</form>
			</main>
			<span className={error ? 'error show' : 'error'}>Username not available</span>
		</div>
	);
}

export default Signup;
