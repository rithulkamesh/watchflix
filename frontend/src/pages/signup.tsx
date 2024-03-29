import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../components/inputField';
import Router from 'next/router';
import * as yup from 'yup';
import Loader from '../components/loading';
import Link from 'next/link';
import { validateLogin } from '../utils/fetch';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required().min(6),
	name: yup.string().required().min(3),
	// check if confirm password is equal to password
	confirmPassword: yup
		.string()
		.required()
		.oneOf([yup.ref('password'), null], 'Passwords must match')
});

const Signup: React.FC = () => {
	const widthAndHeight = 60;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [passConf, setPassConf] = useState('');
	const [loading, setLoading] = useState(true);
	const [validated, setValidated] = useState(false);
	const router = useRouter();

	const login = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		schema
			.isValid({
				email: email,
				password: password,
				name: name,
				confirmPassword: passConf
			})
			.then(async () => {
				await SignupUser(
					email,
					password,
					name,
					toast,
					setPassword,
					setPassConf,
					setLoading
				);
			})
			.catch((e: any) => {
				if (e.message === 'Passwords must match') {
					setPassConf('');
					setPassword('');
					toast.error('Passwords must match');
				} else {
					toast.error(e.message);
				}
			});
	};


	if (loading) {
		if (!validated) {
			validateLogin(
				() => {
					router.push('/');
				},
				() => {
					setLoading(false);
				}
			).then(() => setValidated(true));
		}
		return <Loader />;
	}

	return (
		<div>
			<div className="h-screen w-screen loginBackground">
				<div className="loginLayer">
					<div className="fixed px-20 py-5">
						<Image
							src={'/logo-blue.svg'}
							alt={'Logo'}
							width={widthAndHeight}
							height={widthAndHeight}
							className={'px-1'}
						/>
					</div>
					<div className="w-screen center h-screen">
						<div className="items-center justify-center">
							<div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded">
								<div className="p-10">
									<div
										id="Title"
										className="text-4xl font-bold mb-10"
									>
										Sign Up
									</div>
									<div id="Form" className="center flex-col">
										<form
											className="flex-col center"
											onSubmit={(e) => login(e)}
										>
											<InputField
												type="text"
												placeholder="Enter Your Name"
												onChange={(e) =>
													setName(e.target.value)
												}
												value={name}
												className="mb-0.5"
											/>
											<InputField
												type="email"
												placeholder="Enter Your Email"
												onChange={(e) =>
													setEmail(e.target.value)
												}
												value={email}
												className="mb-0.5"
											/>

											<InputField
												type="password"
												placeholder="Enter Your Password"
												onChange={(e) =>
													setPassword(e.target.value)
												}
												value={password}
												className="mb-0.5"
											/>
											<InputField
												type="password"
												placeholder="Confirm Your Password"
												onChange={(e) =>
													setPassConf(e.target.value)
												}
												value={passConf}
											/>
											<button
												className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded-sm mb-5"
												type="submit"
											>
												Submit
											</button>
										</form>
										<div className="center mb-3">
											<div className="text-sm text-gray-300 flex">
												Already have an account?{' '}
												<Link href={'/login'}>
													<a className="underline decoration-white ml-1">
														Login
													</a>
												</Link>
											</div>
										</div>
									</div>
									<p className="text-center text-slate-100 text-xs">
										Class 12 Project | Rithul Kamesh and
										Apoorva YK
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
				/>
			</div>
		</div>
	);
};

export default Signup;

async function SignupUser(
	email: string,
	password: string,
	name: string,
	toast: any,
	setPassword: Function,
	setPasswordConf: Function,
	setLoading: Function
) {
	await fetch('http://localhost:3001/auth/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: password,
			name: name
		}),
		credentials: 'include'
	})
		.then((r) => r.json())
		.then((data) => {
			if (data.status === 400) {
				toast.error(
					'Another account exists with this email. Please login instead',
					{ theme: 'dark' }
				);
				setPassword('');
				setPasswordConf('');
				return;
			}

			setLoading(true);
			setTimeout(() => {
				Router.push('/');
			}, 1500);
		});
}
