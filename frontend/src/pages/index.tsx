import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/loading';
import '../styles/index.module.css';
import MovieCard from '../components/movieCard';

import HomeLayout from '../layouts/home';
import { validateLogin } from '../utils/fetch';
const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState('Rithul');
	const greetings = [
		'How are you doing today?',
		'Pick something to watch...',
		'Are you feeling lucky?',
		'Dazzling categories...'
	];
	const router = useRouter();
	const validate = async () => {
		validateLogin(()=> {
			setLoading(false);
		}, () => {
			router.push('/login');
		})

		fetch('http://localhost:3001/auth/user', {
			method: 'GET',
			credentials: 'include'
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					setUser(JSON.parse(data.user).name.split(' ')[0]);
				}
			});
	};

	if (loading) {
		validate();
		return <Loader />;
	}
	return (
		<HomeLayout title={`Welcome, ${user}!`}>

			<div className="pl-[3em] text-[35px] font-light">
				Here are some random picks for you!
			</div>


		</HomeLayout>
	);
};

export default Home;
