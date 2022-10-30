import React from 'react';
import Image from 'next/image';
import '../styles/movieCard.module.css';

const movieCard: React.FC = () => {
	return (
		<div className="py-4">
			<div className="shadow-lg group container rounded-md bg-white max-w-sm flex justify-center items-center mx-auto">
				<div className="pt-1">
					<Image
						src="https://source.unsplash.com/random/?movie/"
						width={480}
						height={300}
					/>
				</div>
			</div>
		</div>
	);
};

export default movieCard;
