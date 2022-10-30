import React from 'react';

const Loader = () => {
	return (
		<div>
			<div className="h-screen w-screen loginBackground">
				<div className="loginLayer center">
					<div className="lds-dual-ring"></div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
