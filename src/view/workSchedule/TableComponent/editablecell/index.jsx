import EditableText from '@/component/editableText'

function App({dataIndex,record,children,onChange,...restProps}) {
	console.log(record);
	let childNode=dataIndex?(
		<EditableText
			text={record[dataIndex]}
			onChange={(newValue)=>{
				onChange(record.key,dataIndex,newValue);
			}}
		/>
	):(children);
	return (
		<>
			{/* <td {...restProps}> */}
				{childNode}
			{/* </td> */}
		</>
	);
}

export default App;
