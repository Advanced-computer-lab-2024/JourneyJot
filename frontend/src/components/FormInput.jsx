/** @format */

const FormInput = ({
	label,
	type,
	name,
	value,
	onChange,
	required = false,
}) => {
	return (
		<div className='form-group'>
			<label>{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				className='form-input'
			/>
		</div>
	);
};

export default FormInput;
