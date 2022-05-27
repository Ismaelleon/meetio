import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';

function Header () {
	let location = useLocation();

	return (
		<header className="main-header">
			<div>
				<p>meetio</p>
				<ul>
					<li><Link to="/home"><MaterialIcon color={location.pathname === '/home' ? "#ff005c" : ""} icon="public" size={24} /></Link></li>
					<li><Link to="/matches"><MaterialIcon color={
						location.pathname === '/matches' || 
						location.pathname === '/likes' ||
						location.pathname === '/dislikes' ? "#ff005c" : ""} icon="favorite" size={24} /></Link></li>
					<li><Link to="/profile"><MaterialIcon color={location.pathname === '/profile' ? "#ff005c" : ""} icon="person" size={24} /></Link></li>
				</ul>
			</div>
		</header>
	);
}

export default Header;
