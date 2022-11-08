import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/loading';
import '../styles/index.module.css';
import HomeLayout from '../layouts/home';
import { fetchFromAPI, validateLogin } from '../utils/fetch';

import MovieCard from '../components/movieCard';

const Home: React.FC = () => {
	const [height, setHeight] = useState(0)
  	const ref = useRef(null)
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState('Rithul');
	const [movies, setMovies] = useState([]);
	const router = useRouter();
	useEffect(() => {
		//@ts-ignore
		setHeight(ref?.current?.clientHeight)
	  })
	
	const validate = async () => {
		validateLogin(
			() => {
				setLoading(false);
			},
			() => {
				router.push('/login');
			}
		);

		fetchFromAPI('/auth/user', 'GET').then((data) => {
			if (data.status === 200) {
				setUser(JSON.parse(data.user).name.split(' ')[0]);
			}
		});
		fetchFromAPI('/movies/random/6', 'GET').then((data) => {
			if (data.status === 200) {
				setMovies(data.result.movies);
			}
		});
	};

	if (loading) {
		validate();
		return <Loader />;
	}
	return (
		<HomeLayout title={`Home`}>
			<div className="text-[50px] font-bold">
				<div className="title px-5 ml-24">
					Welcome, {user}, here are picks to watch
				</div>

				<div className={`cards bg-gray-700 h-[${height}px]`} ref={ref}>
					<div className='ml-11  p-5'>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-10">
							{movies.map((movie: any) => {
								return (
									<MovieCard
										title={movie.title}
										description={movie.desc}
										image={movie.poster}
										trailer={movie.trailer}
										key={movie._id}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</HomeLayout>
	);
};

export default Home;
