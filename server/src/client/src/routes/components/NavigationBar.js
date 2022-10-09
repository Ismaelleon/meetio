import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdFavorite, MdPerson } from 'react-icons/md';
import '../stylesheets/app.css';

function NavigationBar () {
	const location = useLocation();
	let [showNavigationBar, setShowNavigationBar] = useState(false);
	let [buttonsColors, setButtonsColors] = useState(['', '', '']);

	useEffect(() => {
		const routes = ['/home', '/matches', '/likes', '/dislikes', '/profile', '/user'];

		for (let route of routes) {
			if (location.pathname === route) {
				setShowNavigationBar(true)
			}
		}

		switch (location.pathname) {
			case '/home':
				setButtonsColors(['#ff005c', '', ''])
			break;
			case '/matches' || '/likes' || '/dislikes':
				setButtonsColors(['', '#ff005c', ''])
			break;
			case '/profile':
				setButtonsColors(['', '', '#ff005c'])
			break;
		}
	}, [location.pathname])

	if (showNavigationBar) {
		return (
			<nav>
				<ul>
					<li>
						<Link to="/home">
							<MdHome color={buttonsColors[0]} fontSize="26px" />
							<span style={{color: buttonsColors[0]}}>Home</span>
						</Link>
					</li>
					<li>
						<Link to="/matches">
							<MdFavorite color={buttonsColors[1]} fontSize="26px" />
							<span style={{color: buttonsColors[1]}}>Interactions</span>
						</Link>
					</li>
					<li>
						<Link to="/profile">
							<MdPerson color={buttonsColors[2]} fontSize="26px" />
							<span style={{color: buttonsColors[2]}}>Profile</span>
						</Link>
					</li>
				</ul>
			</nav>
		);
	} else {
		return <></>
	}
}

export default NavigationBar;
