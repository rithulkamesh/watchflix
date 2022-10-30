import React, { useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Verify: React.FC = () => {
	const router = useRouter();
	const code = router.query.code;

	if (router.query.code) {
		setCookie('code', code, { path: '/verify' });
		router.push('/verify');
	}

	if (getCookie('code')) {
		fetch(`http://localhost:3001/auth/verify/${getCookie('code')}`, {
			method: 'POST',
			credentials: 'include'
		})
			.then((r) => r.json())
			.then((data) => {
				if (data.status === 400 || data.status === 200) {
					(async () => {
						await deleteCookie('code');
					})();
				}

				return router.push('/');
			});
	}

	// router.push("/login");
	const size = 500;

	return (
		<div>
			<div className="h-screen w-screen loginBackground">
				<div className="loginLayer">
					<div className="flex h-screen flex-col items-center justify-center">
						<Image src={'/Mail.svg'} height={size} width={size} />
						<div className="text-4xl font-bold mb-10">
							Verifying...
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Verify;
