import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/loading';
import '../styles/index.module.css';
import HomeLayout from '../layouts/home';
import { fetchFromAPI, validateLogin } from '../utils/fetch';
import MovieCard from '../components/movieCard';

const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState('Rithul');
	const [movies, setMovies] = useState([]);
	const greetings = [
		'How are you doing today?',
		'Pick something to watch...',
		'Are you feeling lucky?',
		'Dazzling categories...'
	];
	const router = useRouter();
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
				<div className="title px-5">Welcome, {user}, here are picks to watch</div>

				<div className="cards py-5 bg-gray-700">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-10">
						{movies.map((movie: any) => {
							console.log(movie);
							return (
								<MovieCard
									title={movie.title}
									description={movie.desc}
									image={movie.poster}
									trailer={movie.trailer}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</HomeLayout>
	);
};

export default Home;
