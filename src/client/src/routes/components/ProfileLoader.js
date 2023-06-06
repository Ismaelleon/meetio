import React from 'react';
import ContentLoader from 'react-content-loader';

function ProfileLoader (props) {
	return (
		<ContentLoader width={232} height={472} viewBox="0 0 232 472" {...props} 
		backgroundColor="#d9d9d9" foregroundColor="#ecebeb" style={{
			display: 'block',
			margin: 'auto'
		}}>	
			<circle cx="116" cy="163" r="75" />
			<rect x="19.5" y="263" width="195" height="28" />
			<rect x="53.5" y="306" width="125" height="20" />
		</ContentLoader>
	);
}

export default ProfileLoader;
