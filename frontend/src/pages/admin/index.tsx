import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import HomeLayout from '../../layouts/home';
import InputField from '../../components/inputField';
import { toast } from 'react-toastify';
type Props = {};

const index: React.FC = (props: Props) => {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [poster, setPoster] = useState('');
	const [trailer, setTrailer] = useState('');

	fetch('http://localhost:3001/auth/user', {
		method: 'GET',
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.status === 200) {
				if (!JSON.parse(data.user).isAdmin) {
					router.push('/');
				}
			}
		});

	const addMovie = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		fetch('http://localhost:3001/movies/create', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title,
				description,
				poster,
				trailer
			})
		})
			.then((data) => {
				if (data.status === 200) {
					// Clear and Toast
					setTitle('');
					setDescription('');
					setPoster('');
					setTrailer('');

					toast('Movie Added', { theme: 'dark' });
				}
			});
	};
	return (
		<HomeLayout title="Add a movie">
			<div className="flex flex-col items-center justify-center">
				<div className="text-3xl font-bold">Add a movie</div>
				<div className="flex flex-col items-center justify-center">
					<div id="Form" className="center flex-col">
						<form
							className="flex-col center"
							onSubmit={(e) => addMovie(e)}
						>
							<InputField
								type="text"
								placeholder="Movie Title"
								onChange={(e) => setTitle(e.target.value)}
								value={title}
								className="mb-0.5"
							/>

							<InputField
								type="text"
								placeholder="Movie description"
								onChange={(e) => setDescription(e.target.value)}
								value={description}
								className="mb-0.5"
							/>
							<InputField
								type="text"
								placeholder="Poster link"
								onChange={(e) => setPoster(e.target.value)}
								value={poster}
								className="mb-0.5"
							/>
							<InputField
								type="text"
								placeholder="Trailer link"
								onChange={(e) => setTrailer(e.target.value)}
								value={trailer}
							/>
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded-sm mb-5"
								type="submit"
							>
								Submit
							</button>
						</form>
					</div>
					<p className="text-center text-slate-100 text-xs">
						Class 12 Project | Rithul Kamesh and Apoorva YK
					</p>
				</div>
			</div>
		</HomeLayout>
	);
};
export default index;
