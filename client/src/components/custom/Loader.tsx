export const Loader = () => {
	return (
		<div className="w-[65px] m-auto">
			<div className="flex flex-col items-center">
				<div className="animate-flip">
					<img src="./loader-coin.png" alt="Loading coin" />
				</div>
				<div>
					<img src="./loader-hand.png" alt="Loading hand" />
				</div>
			</div>
		</div>
	);
};
