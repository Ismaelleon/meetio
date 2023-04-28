import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

function HomeLoader (props) {
	const [width, setWidth] = useState(0),
		[height, setHeight] = useState(0);

	function setWindowSize () {
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
	}

	useEffect(setWindowSize, [])

	return (
		<ContentLoader width={width} height={(height * 70) / 100} viewBox={`0 0 ${width} ${(height * 70) / 100}`} 
			backgroundColor="#d9d9d9" foregroundColor="#ecebeb" {...props}>
			<rect x="0" y="0" width={`${width}`} height={`${height / 2}`} />
			<rect x="20" y={`${(height / 2) + 25}`} width="170" height="25" />
			<rect x="20" y={`${(height / 2) + 55}`} width={`${width - 40}`} height="20" />
			<rect x="20" y={`${(height / 2) + 80}`} width={`${width - 40}`} height="20" />
		</ContentLoader>
	);
}

export default HomeLoader;
