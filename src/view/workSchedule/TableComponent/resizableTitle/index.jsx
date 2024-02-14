import { Resizable } from 'react-resizable';

const App = (props) => {
	const { onResize, width, ...restProps } = props;
	if (!width) {
		return <th {...restProps} />;
	}
	return (
		<Resizable
			style={{
				position: "relative",
				backgroundClip: "padding-box",
			}}
			width={width}
			height={0}
			handle={
				<span
					style={{
						position: "absolute",
						right: "-5px",
						bottom: 0,
						zIndex: 1,
						width: "10px",
						height: "100%",
						cursor: "col-resize"
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
				/>
			}
			onResize={onResize}
			draggableOpts={{
				enableUserSelectHack: false,
			}}
		>
			<th {...restProps} />
		</Resizable>
	);
};
export default App;