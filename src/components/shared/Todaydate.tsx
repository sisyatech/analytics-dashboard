const TodayDate = () => {
	const today = new Date();

	const day = today.getDate();

	const month = today.toLocaleString("default", {
		month: "long",
	});

	const year = today.getFullYear();

	return (
		<div className="text-right">
			<div className="text-4xl font-bold text-black">{day}</div>
			<div className="text-4xl font-semibold text-black">
				{month}, {year}
			</div>
		</div>
	);
};

export default TodayDate;
