import React, { useState } from 'react';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import InputField from '../components/inputField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from '../layouts/auth';
import AuthForm from '../components/authForm';
import Loader from '../components/loading';

const schema = yup.object().shape({
	password: yup.string().required().min(6),
	confirmPassword: yup
		.string()
		.required()
		.oneOf([yup.ref('password'), null], 'Passwords must match')
});

const Forgot: React.FC = () => {
	const router = useRouter();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [validated, setValidated] = useState(false);
	const [err, setErr] = useState('');

	const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		if (password !== confirmPassword) {
			toast.error('Passwords must match', { theme: 'dark' });
			setLoading(false);
			setConfirmPassword('');
			setPassword('');
			return;
		}
		await schema.isValid({ password, confirmPassword }).then((valid) => {
			if (valid) {
				setValidated(true);
			} else {
				setErr('Passwords must be at least 6 characters long');
				setLoading(false);
			}
		});

		if (validated) {
			setLoading(true);
			fetch(
				`http://localhost:3001/auth/forgot?token=${router.query.token}`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						newpassword: password
					})
				}
			).then((data) => {
				if (data.status === 200) {
					-toast.success('Password reset successfully', {
						theme: 'dark'
					});
					router.push('/login');
				} else if (data.status === 400) {
					toast.error('Token not found', { theme: 'dark' });
				} else {
					toast.error('Token not found', { theme: 'dark' });
				}
			});
		}
		setLoading(false);
	};

	if (loading) {
		return <Loader />;
	}

	if (router.query.token) {
		return (
			<AuthLayout title="Reset Password">
				<AuthForm onSumbit={(e) => resetPassword(e)}>
					<InputField
						type="password"
						placeholder="Enter Your Password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						className="mb-0.5"
					/>
					<InputField
						type="password"
						placeholder="Confirm Your Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						value={confirmPassword}
					/>
					{err && <p className="text-white-500 pb-5">{err}</p>}
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded-sm mb-5"
						type="submit"
					>
						Submit
					</button>
				</AuthForm>
			</AuthLayout>
		);
	}

	const sendResetLink = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		await fetch('http://localhost:3001/auth/forgot', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email
			})
		}).then((data) => {
			if (data.status === 200) {
				toast.success('Reset link sent to your email', {
					theme: 'dark'
				});
				router.push('/login');
			} else if (data.status === 400) {
				toast.error('Email not found', { theme: 'dark' });
			} else {
				toast.error('Email not found', { theme: 'dark' });
			}
		});
		setLoading(false);
	};

	return (
		<AuthLayout title="Reset Password">
			<AuthForm
				onSumbit={(e) => {
					sendResetLink(e);
				}}
			>
				<InputField
					type="email"
					placeholder="Enter Your Email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					className="mb-10"
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

export default Forgot;
