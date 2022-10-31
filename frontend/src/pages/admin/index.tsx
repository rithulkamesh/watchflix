import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { SideBar } from '../../components/sidebar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import HomeLayout from '../../layouts/home';
type Props = {};

const index: React.FC = (props: Props) => {
	const router = useRouter();

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
	return (
        <HomeLayout title='Add a movie'>

        </HomeLayout>
	);
};
export default index;

function submit_data(values: {
	title: string;
	description: string;
	poster: string;
	trailer: string;
}) {
	console.log(values);
}
