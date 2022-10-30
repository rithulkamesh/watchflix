import React, { useEffect, useState } from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import InputField from '../components/inputField';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
	password: yup.string().required().min(6),
	confirmPassword: yup
		.string()
		.required()
		.oneOf([yup.ref('password'), null], 'Passwords must match')
});

const Forgot: React.FC = () => {
	const router = useRouter();
	const code = router.query.code;

	const [passConf, setPassConf] = useState('');
	const [password, setPassword] = useState('');

	if (router.query.code) {
		setCookie('forgotCode', code, { path: '/reset' });
		router.push('/reset');
	}

	function reset(event: any) {
		event.preventDefault();

		if (getCookie('forgotCode')) {
			schema
				.isValid({ password, passConf })
				.then(async () => {
					await fetch(
						`http://localhost:3001/auth/forgot/${getCookie(
							'forgotCode'
						)}`,
						{
							method: 'POST',
							credentials: 'include',
							body: JSON.stringify({
								newpassword: password
							})
						}
					)
						.then((r) => r.json())
						.then((data) => {
							if (data.status === 400) {
								(async () => {
									await deleteCookie('forgotCode');
								})();
								toast.error('Invalid Code', { theme: 'dark' });
							}
							if (data.status === 200) {
								return router.push('/');
							}
						});
				})
				.catch((e: any) => {
					console.log(e);
				});
		}
	}

	// router.push("/login");
	const size = 500;
	const widthAndHeight = 80;

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
										Reset Your Password
									</div>
									<div id="Form" className="center flex-col">
										<form
											className="flex-col center"
											onSubmit={(e) => {
												reset(e);
											}}
										>
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
									</div>
									<p className="text-center text-slate-100 text-xs">
										Class 12 Project | Rithul Kamesh and
										Apoorva YK
									</p>
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
				</div>
			</div>
		</div>
	);
};

export default Forgot;
