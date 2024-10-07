/** @format */

const Button = ({ label, onClick, className }) => {
	return (
		<button
			className={`btn ${className}`}
			onClick={onClick}>
			{label}
		</button>
	);
};

export default Button;
