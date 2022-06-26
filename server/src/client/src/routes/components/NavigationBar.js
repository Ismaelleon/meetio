import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';

function NavigationBar () {
	let location = useLocation();

	return (
		<nav>
			<ul>
				<li>
					<Link to="/home">
						<MaterialIcon color={location.pathname === '/home' ? "#ff005c" : ""} icon="public" size={26} />
						<span style={{color: location.pathname === '/home' ? "#ff005c" : ""}}>Home</span>
					</Link>
				</li>
				<li>
					<Link to="/matches">
						<MaterialIcon color={
							location.pathname === '/matches' || 
							location.pathname === '/likes' ||
							location.pathname === '/dislikes' ? "#ff005c" : ""} icon="favorite" size={26} />
						<span style={{color: 
							location.pathname === '/matches' || 
							location.pathname === '/likes' ||
							location.pathname === '/dislikes' ? "#ff005c" : ""}}>Interactions</span>
					</Link>
				</li>
				<li>
					<Link to="/profile">
						<MaterialIcon color={location.pathname === '/profile' ? "#ff005c" : ""} icon="person" size={26} />
						<span style={{color: location.pathname === '/profile' ? "#ff005c" : ""}}>Profile</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default NavigationBar;
