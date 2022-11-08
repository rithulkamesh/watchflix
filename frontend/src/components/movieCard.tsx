import React from 'react';
import Image from 'next/image';
import '../styles/movieCard.module.css';

type Props = {
	title: string,
	description: string,
	image: string,
	trailer: string,
}

const movieCard: React.FC<Props> = ({title, description, image, trailer}: Props) => {
	// trim description
	const trimDescription = (description: string) => {
		if (description.length > 100) {
			return description.substring(0, 100) + '...';
		}
		return description;
	};

	return (
		<div className="flex justify-center ml-5 px-5 py-5">
  <div className="rounded-lg shadow-lg bg-white max-w-md min-w-md">
    <a href="#!">
      <img className="rounded-t-lg" src={image} alt=""/>
    </a>
    <div className="p-6">
      <h5 className="text-gray-900 text-xl font-medium mb-2">{title}</h5>
      <p className="text-gray-700 text-base mb-4">
		{trimDescription(description)}
      </p>
      <a href={trailer.replace(/^\s+|\s+$|"/g, '')} target="blank" type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Watch Trailer</a>
    </div>
  </div>
</div>

	);
};

export default movieCard;
