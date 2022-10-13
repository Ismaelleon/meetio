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
		const currentPathname = '/' + location.pathname.split('/')[1];

		let validRouteToShow = false; 

		for (let route of routes) {
			if (currentPathname === route) {
				 validRouteToShow = true;
			}
		}

		setShowNavigationBar(validRouteToShow)


		if (location.pathname === '/home') {
			setButtonsColors(['#ff005c', '', ''])
		} else if (location.pathname === '/matches' || location.pathname === '/likes' || location.pathname === '/dislikes') {
			setButtonsColors(['', '#ff005c', ''])
		} else if (location.pathname === '/profile') {
			setButtonsColors(['', '', '#ff005c'])
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
