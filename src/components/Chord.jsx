import React from 'react';

function Chord({ first, third, fifth }) {
	return (
		<div>
			<span>{first}</span>
			<span>{third}</span>
			<span>{fifth}</span>
		</div>
	);
}

export default Chord;
