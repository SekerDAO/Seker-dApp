import React, {FunctionComponent} from "react"

const TelegramIcon: FunctionComponent<{fill: string}> = ({fill}) => (
	<svg viewBox="0 0 25 25" width={25} height={25}>
		<path
			fill={fill}
			d="M18.6,7.7L10.4,15l-0.3,3.4l-1.6-4.9l9.5-6C18.5,7.2,18.9,7.4,18.6,7.7z M25,3.1v18.7c0,1.7-1.4,3.1-3.1,3.1
	H3.1C1.4,25,0,23.6,0,21.9V3.1C0,1.4,1.4,0,3.1,0h18.7C23.6,0,25,1.4,25,3.1z M20.8,4.6L3.8,11.1c-1.2,0.5-1.1,1.1-0.2,1.4l4.2,1.3
	l1.6,5c0.2,0.5,0.1,0.8,0.7,0.8c0.3,0,0.7-0.2,0.9-0.4l2.1-2.1l4.4,3.2c0.8,0.4,1.4,0.2,1.6-0.8L22,6C22.3,4.8,21.5,4.2,20.8,4.6z"
		/>
	</svg>
)

export default TelegramIcon
