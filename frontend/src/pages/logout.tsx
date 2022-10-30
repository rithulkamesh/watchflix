import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/router';
import Loader from '../components/loading';
import { fetchFromAPI, validateLogin } from '../utils/fetch';

const Logout: React.FC = () => {
	const widthAndHeight = 60;

	const [loading, setLoading] = useState(true);
	const [validated, setValidated] = useState(false);
	const router = useRouter();

	

	if (loading) {
		if (!validated) {
			validateLogin(
				() => {
					fetchFromAPI("/auth/logout", "POST");
					router.push('/login');
				},
				() => {
					setLoading(false);
				}
			).then(() => setValidated(true));
			setValidated(true);
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
										Logging you out...
									</div>
									<div className="center flex-col">
										<div className="center mb-10">
											<div className="lds-dual-ring"></div>
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

export default Logout;
