import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

function InteractionsLoader (props) {
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
		<ContentLoader width={width} height={height} onResize={setWindowSize}
			viewBox={ `0 0 ${width} ${window.innerHeight}` } {...props} 
			backgroundColor="#d9d9d9" foregroundColor="#ecebeb"
			style={{ display: 'block', margin: 'auto', padding: '.75rem' }}>	

			<rect x={`${width / 2 - 160}`} y="72" width="60" height="20" />
			<rect x={`${width / 2 - 30}`} y="72" width="60" height="20" />
			<rect x={`${width / 2 + 100}`} y="72" width="60" height="20" />

			<circle cx="31" cy="157" r="30" />
			<rect x="90" y="147" width="150" height="20" />
			<circle cx="31" cy="249" r="30" />
			<rect x="90" y="239" width="150" height="20" />
			<circle cx="31" cy="341" r="30" />
			<rect x="90" y="331" width="150" height="20" />
			<circle cx="31" cy="433" r="30" />
			<rect x="90" y="423" width="150" height="20" />
			<circle cx="31" cy="524" r="30" />
			<rect x="90" y="514" width="150" height="20" />
			<circle cx="31" cy="617" r="30" />
			<rect x="90" y="607" width="150" height="20" />
		</ContentLoader>
	);
}

export default InteractionsLoader;
