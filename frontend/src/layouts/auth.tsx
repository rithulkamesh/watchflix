import React from 'react';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

type Props = {
	children: React.ReactNode;
	title: string;
};

const AuthLayout = (props: Props) => {
	const widthAndHeight = 60;

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
										{props.title}
									</div>
                                {props.children}

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

export default AuthLayout;
