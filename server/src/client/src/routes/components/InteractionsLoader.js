import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

function InteractionsLoader (props) {
	let [width, setWidth] = useState(0),
		[height, setHeight] = useState(0);

	function setWindowSize () {
		setWidth(window.innerWidth)
		setHeight(window.innerHeight - 60)
	}

	useEffect(setWindowSize, [])

	return (
		<ContentLoader width={width} height={height} onResize={setWindowSize}
			viewBox={ `0 0 ${window.innerWidth} ${window.innerHeight}` } {...props} 
			backgroundColor="#d9d9d9" foregroundColor="#ecebeb"
			style={{ display: 'block', margin: 'auto' }}>	

			<rect x={`${width / 2 - 130}`} y="20" width="60" height="20" />
			<rect x={`${width / 2 - 30}`} y="20" width="60" height="20" />
			<rect x={`${width / 2 + 70}`} y="20" width="60" height="20" />

			<circle cx="42" cy="100" r="42" />
			<rect x="104" y="90" width="150" height="20" />
			<circle cx="42" cy="225" r="42" />
			<rect x="104" y="215" width="150" height="20" />
			<circle cx="42" cy="350" r="42" />
			<rect x="104" y="340" width="150" height="20" />
			<circle cx="42" cy="475" r="42" />
			<rect x="104" y="465" width="150" height="20" />
			<circle cx="42" cy="600" r="42" />
			<rect x="104" y="590" width="150" height="20" />
			<circle cx="42" cy="725" r="42" />
			<rect x="104" y="715" width="150" height="20" />
		</ContentLoader>
	);
}

export default InteractionsLoader;
