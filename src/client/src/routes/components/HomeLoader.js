import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

function HomeLoader (props) {
	const [width, setWidth] = useState(0),
		[height, setHeight] = useState(0);

	function setWindowSize () {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);

		if (window.innerWidth > 512) {
			setWidth(512);
		}
	}

	useEffect(setWindowSize, [])

	return (
		<ContentLoader width={width} height={height} style={{ margin: 'auto' }} viewBox={`0 0 ${width} ${height}`} 
			backgroundColor="#d9d9d9" foregroundColor="#ecebeb" {...props}>
			<rect x="0" y="52" width={`${width}`} height={`${height / 2}`} />
			<circle cx="75" cy={`${height / 2 + 52}`} r="55" />
			<rect x="20" y={`${(height / 2 + 52) + 75}`} width="100" height="25" />
			<rect x="20" y={`${(height / 2 + 52) + 110}`} width="200" height="20" />
		</ContentLoader>
	);
}

export default HomeLoader;
