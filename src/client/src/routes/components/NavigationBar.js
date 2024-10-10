import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdOutlineHome, MdFavorite, MdOutlineFavoriteBorder, MdPerson, MdOutlinePerson } from 'react-icons/md';

function NavigationBar () {
	const location = useLocation();
	
	const [showNavigationBar, setShowNavigationBar] = useState(false),
		[buttonsColors, setButtonsColors] = useState(['', '', '']);

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
			setButtonsColors(['#ff005c', '', '']);
		} else if (location.pathname === '/matches' || location.pathname === '/likes' || location.pathname === '/dislikes') {
			setButtonsColors(['', '#ff005c', '']);
		} else if (location.pathname === '/profile') {
			setButtonsColors(['', '', '#ff005c']);
		} else {
			setButtonsColors(['', '', '']);
		}
	}, [location.pathname])

	if (showNavigationBar) {
		return (
			<nav className="fixed bottom-0 left-0 w-full bg-white p-1.5 -shadow-sm shadow-neutral-300 sm:hidden">
				<ul className="flex flex-row justify-around">
					<li>
						<Link className="flex flex-col items-center" to="/home">
							{location.pathname === '/home' ?
								<MdHome color={buttonsColors[0]} fontSize="26px" /> :
								<MdOutlineHome color={buttonsColors[0]} fontSize="26px" className="text-neutral-500" />}
							<span style={{color: buttonsColors[0]}} className="text-base text-neutral-500">Home</span>
						</Link>
					</li>
					<li>
						<Link className="flex flex-col items-center" to="/matches">
							{location.pathname === '/matches' ||
							 location.pathname === '/likes' ||
							 location.pathname === '/dislikes' ?
								<MdFavorite color={buttonsColors[1]} fontSize="26px" /> :
								<MdOutlineFavoriteBorder color={buttonsColors[1]} fontSize="26px" className="text-neutral-500" />}
							<span style={{color: buttonsColors[1]}} className="text-base text-neutral-500 leading-0">Interactions</span>
						</Link>
					</li>
					<li>
						<Link className="flex flex-col items-center" to="/profile">
							{location.pathname === '/profile' ?
								<MdPerson color={buttonsColors[2]} fontSize="26px" /> :
								<MdOutlinePerson color={buttonsColors[2]} fontSize="26px" className="text-neutral-500" />}
							<span style={{color: buttonsColors[2]}} className="text-base text-neutral-500">Profile</span>
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
