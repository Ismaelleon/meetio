import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdFavorite, MdPerson } from 'react-icons/md';

function Header () {
	let location = useLocation();
	let [showHeader, setShowHeader] = useState(false);
	let [buttonsColors, setButtonsColors] = useState(['', '', '']);

	useEffect(() => {
		const routes = ['/home', '/matches', '/likes', '/dislikes', '/profile', '/user'];
		let validRouteToShow = false; 

		for (let route of routes) {
			if (location.pathname === route) {
				 validRouteToShow = true;
			}
		}

		setShowHeader(validRouteToShow)

		if (location.pathname === '/home') {
			setButtonsColors(['#ff005c', '', ''])
		} else if (location.pathname === '/matches' || location.pathname === '/likes' || location.pathname === '/dislikes') {
			setButtonsColors(['', '#ff005c', ''])
		} else if (location.pathname === '/profile') {
			setButtonsColors(['', '', '#ff005c'])
		}

	}, [location.pathname])

	if (showHeader) {
		return (
			<header className="main-header" style={{ display: showHeader ? 'flex' : 'none' }}>
				<div>
					<p>Meetio</p>
					<ul>
						<li><Link to="/home"><MdHome color={buttonsColors[0]} fontSize="24px" /></Link></li>
						<li><Link to="/matches"><MdFavorite color={buttonsColors[1]} fontSize="24px" /></Link></li>
						<li><Link to="/profile"><MdPerson color={buttonsColors[2]} fontSize="24px" /></Link></li>
					</ul>
				</div>
			</header>
		);
	} else {
		return <></>
	}
}

export default Header;
