import React from 'react';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function TypeIcon({ type }) {
	if (!type) return <></>;
	switch (type.toLowerCase()) {
		case 'gym':
		case 'strength':
			return <FitnessCenterIcon />;
		case 'cycle':
		case 'bicycle':
		case 'cycling':
			return <DirectionsBikeIcon />;
		case 'run':
		case 'running':
			return <DirectionsRunIcon />;
		case 'walk':
		case 'walking':
		default:
			return <DirectionsWalkIcon />;
	}
}


export default TypeIcon;