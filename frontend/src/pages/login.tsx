import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import InputField from '../components/inputField';
import { NextRouter, useRouter } from 'next/router';
import * as yup from 'yup';
import Loader from '../components/loading';
import Link from 'next/link';
import AuthLayout from '../layouts/auth';
import AuthForm from '../components/authForm';
import { validateLogin } from '../utils/fetch';

const schema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required().min(6)
});

const Login: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(true);
	const [validated, setValidated] = useState(false);
	const router = useRouter();

	const login = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		schema
			.isValid({ email, password })
			.then(async () => {
				await LoginUser(
					email,
					password,
					toast,
					setPassword,
					setLoading,
					router
				);
			})
			.catch(() => {
				toast.error('Invalid email or Password', { theme: 'dark' });
				setPassword('');
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
		<AuthLayout title="Login">
			<AuthForm
				onSumbit={(e) => login(e)}
				extras={() => {
					return (
						<div className="center mb-3">
							<div className="text-sm text-gray-300 flex">
								Don't have an account?{' '}
								<Link href={'/signup'}>
									<a className="underline decoration-white ml-1">
										Sign Up
									</a>
								</Link>
							</div>
						</div>
					);
				}}
			>
				<InputField
					type="email"
					placeholder="Enter Your Email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					className="mb-0.5"
				/>

				<InputField
					type="password"
					placeholder="Enter Your Password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded-sm mb-5"
					type="submit"
				>
					Submit
				</button>
			</AuthForm>
		</AuthLayout>
	);
};

export default Login;

async function LoginUser(
	email: string,
	password: string,
	toast: any,
	setPassword: Function,
	setLoading: Function,
	router: NextRouter
) {
	await fetch('http://localhost:3001/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: password
		}),
		credentials: 'include'
	})
		.then((r) => r.json())
		.then((data) => {
			if (data.status === 400) {
				toast.error(
					'Your Email or Password was not found.. Please check your details again.',
					{ theme: 'dark' }
				);
				setPassword('');
				return;
			}
			if (data.status === 403) {
				toast.error('Please Verify Your Account.', { theme: 'dark' });
				setPassword('');
				return;
			}

			setLoading(true);
			setTimeout(() => {
				router.push('/');
			}, 1500);
		});
}
