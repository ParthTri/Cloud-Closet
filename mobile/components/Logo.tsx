import { Image } from "react-native";

type Props = {
	logoWidth: number;
	logoHeight: number;
	style?: any;
};

export function Logo({ logoWidth = 200, logoHeight = 200, style }: Props) {
	return (
		<Image
			source={require("@/assets/images/logo.png")}
			style={{
				width: logoWidth,
				height: logoHeight,
				...style,
			}}
		/>
	);
}
