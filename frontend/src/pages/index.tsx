import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/loading';
import '../styles/index.module.css';
import { SideBar, SideBarIcon } from '../components/sidebar';
import MovieCard from '../components/movieCard';

import { BsGear } from 'react-icons/bs';
import HomeLayout from '../layouts/home';
const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState('Rithul');
	const [isAdmin, setIsAdmin] = useState(false);
	const greetings = [
		'How are you doing today?',
		'Pick something to watch...',
		'Are you feeling lucky?',
		'Dazzling categories...'
	];
	const router = useRouter();
	const validate = async () => {
		fetch('http://localhost:3001/auth/validate', {
			method: 'POST',
			credentials: 'include'
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					setLoading(false);
				} else {
					router.push('/login');
				}
			});

		fetch('http://localhost:3001/auth/user', {
			method: 'GET',
			credentials: 'include'
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 200) {
					setUser(JSON.parse(data.user).name.split(' ')[0]);
					setIsAdmin(JSON.parse(data.user).isAdmin);
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
