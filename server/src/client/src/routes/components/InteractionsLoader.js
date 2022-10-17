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

			<rect x={`${width / 2 - 160}`} y="20" width="60" height="20" />
			<rect x={`${width / 2 - 30}`} y="20" width="60" height="20" />
			<rect x={`${width / 2 + 100}`} y="20" width="60" height="20" />

			<circle cx="31" cy="105" r="30" />
			<rect x="90" y="95" width="150" height="20" />
			<circle cx="31" cy="197" r="30" />
			<rect x="90" y="187" width="150" height="20" />
			<circle cx="31" cy="289" r="30" />
			<rect x="90" y="279" width="150" height="20" />
			<circle cx="31" cy="381" r="30" />
			<rect x="90" y="371" width="150" height="20" />
			<circle cx="31" cy="472" r="30" />
			<rect x="90" y="462" width="150" height="20" />
			<circle cx="31" cy="565" r="30" />
			<rect x="90" y="555" width="150" height="20" />
		</ContentLoader>
	);
}

export default InteractionsLoader;
