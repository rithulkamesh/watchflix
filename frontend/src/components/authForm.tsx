import React, { FormEvent } from 'react';
import Link from 'next/link';

type Props = {
	children: React.ReactNode;
	onSumbit: (e: FormEvent<HTMLFormElement>) => void;
    extras?: () => React.ReactNode;
};

const AuthForm = (props: Props) => {
	return (
		<>
			<div id="Form" className="center flex-col">
				<form
					className="flex-col center"
					onSubmit={(e) => props.onSumbit(e)}
				>
					{props.children}
				</form>
			</div>
			<p className="text-center text-slate-100 text-xs">
				Class 12 Project | Rithul Kamesh and Apoorva YK
			</p>
		</>
	);
};

export default AuthForm;
