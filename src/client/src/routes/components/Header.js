import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdFavorite, MdPerson } from 'react-icons/md';

function Header () {
	const location = useLocation();
	const [showHeader, setShowHeader] = useState(false);
	const [buttonsColors, setButtonsColors] = useState(['', '', '']);

	useEffect(() => {
		const routes = ['/home', '/matches', '/likes', '/dislikes', '/profile', '/user'];
		const currentPathname = '/' + location.pathname.split('/')[1];

		let validRouteToShow = false; 

		for (let route of routes) {
			if (currentPathname === route) {
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
			<header className="fixed bg-white w-full px-5 py-3 shadow-sm shadow-neutral-300" style={{ display: showHeader ? 'flex' : 'none' }}>
				<div className="flex flex-row justify-between items-center w-full max-w-4xl mx-auto">
					<p className="text-2xl font-bold sm:text-xl">Meetio</p>
					<ul className="flex flex-row">
						<li className="hidden sm:block mx-4"><Link to="/home"><MdHome color={buttonsColors[0]} fontSize="22px" /></Link></li>
						<li className="hidden sm:block mx-4"><Link to="/matches"><MdFavorite color={buttonsColors[1]} fontSize="22px" /></Link></li>
						<li className="hidden sm:block mx-4"><Link to="/profile"><MdPerson color={buttonsColors[2]} fontSize="22px" /></Link></li>
					</ul>
				</div>
			</header>
		);
	} else {
		return <></>
	}
}

export default Header;
