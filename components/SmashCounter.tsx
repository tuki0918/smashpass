"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

const SmashCounter: FC = () => {
	const [count, setCount] = useState<number | null>(null);

	const animation = useSpring({
		from: { opacity: 0.3, transform: "scale(0.5)" },
		to: { opacity: 1, transform: "scale(1)" },
		reset: true,
		config: { tension: 300, friction: 10 },
	});

	useEffect(() => {
		// initial count with animation
		setCount(0);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-white rounded-2xl shadow-lg">
				<div className="flex items-center justify-center space-x-6 w-32 h-32">
					<animated.span
						style={animation}
						className="counter-value text-6xl font-bold text-gray-600"
					>
						{count}
					</animated.span>
				</div>
			</div>
		</div>
	);
};

export default SmashCounter;
