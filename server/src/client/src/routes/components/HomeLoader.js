import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

function HomeLoader (props) {
	let [width, setWidth] = useState(0),
		[height, setHeight] = useState(0);

	function setWindowSize () {
		setWidth(window.innerWidth)
		setHeight((window.innerHeight / 100) * 70)
	}

	useEffect(setWindowSize, [])

	return (
		<ContentLoader width={width} height={height} viewBox={`0 0 ${width} ${height}`} 
			backgroundColor="#d9d9d9" foregroundColor="#ecebeb" {...props}>
			<rect x="0" y="0" width={`${width}`} height={`${height - 110}`} />
			<rect x="20" y={`${height - 90}`} width="170" height="35" />
			<rect x="20" y={`${height - 45}`} width={`${width - 40}`} height="20" />
			<rect x="20" y={`${height - 20}`} width={`${width - 40}`} height="20" />
		</ContentLoader>
	);
}

export default HomeLoader;
