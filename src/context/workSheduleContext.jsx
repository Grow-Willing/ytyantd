import { createContext, useContext, useReducer } from 'react';

const WorkSheduleContext = createContext(null);

const WorkSheduleDispatchContext = createContext(null);
import axios from "axios";

const initialWorkShedulestate = {
	people:{
		columns:[
			{
				title: '姓名',
				dataIndex: 'name',
			},
			{
				title: '资质',
				dataIndex: 'qualification',
				type:"dependency",
			},
			{
				title:"等价组",
				dataIndex:"equalGroup", 
				type:"dependency",
			},
		],
		key:0,
		data:[]
	},
	shifts:{
		columns:[
			{
				title: '班名称',
				dataIndex: 'shiftname',
			},
			{
				title: '上班人数',
				dataIndex: 'count',
			},
			{
				title: '班时长',
				dataIndex: 'length',
			},
			{
				title: '最短连续天数',
				dataIndex: 'minlength',
			},
			{
				title: '最大连续天数',
				dataIndex: 'maxlength',
			},
		],
		key:0,
		data:[]
	},
	offdays:{
		columns:[
			{
				title: '最短连续天数',
				dataIndex: 'minlength',
			},
			{
				title: '最大连续天数',
				dataIndex: 'maxlength',
			},
		],
		key:0,
		data:[]
	},
	dependency:{
		equalGroup:[
			"第一小队",
			"第二小队",
			"第三小队",
		]
	}
};
export function WorkSheduleProvider({ children }) {
	const [WorkShedule, dispatch] = useReducer(
		WorkSheduleReducer,
		initialWorkShedulestate
	);

	return (
		<WorkSheduleContext.Provider value={WorkShedule}>
			<WorkSheduleDispatchContext.Provider value={dispatch}>
				{children}
			</WorkSheduleDispatchContext.Provider>
		</WorkSheduleContext.Provider>
	);
}

export function useWorkShedule() {
	return useContext(WorkSheduleContext);
}

export function useWorkSheduleDispatch() {
	return useContext(WorkSheduleDispatchContext);
}

function WorkSheduleReducer(lastWorkShedule, action) {
	switch (action.type) {
		case 'setColumns': {
			if(action.tableName&&action.columns&&Object.keys(lastWorkShedule).includes(action.tableName)){
				let newstate={...lastWorkShedule};
				if(typeof action.columns === "function"){
					newstate[action.tableName]["columns"] = action.columns(lastWorkShedule[action.tableName]["columns"]);
				}else{
					newstate[action.tableName]["columns"] = action.columns;
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setData': {
			if(action.tableName&&action.data&&Object.keys(lastWorkShedule).includes(action.tableName)){
				let newstate={...lastWorkShedule};
				if(typeof action.data === "function"){
					newstate[action.tableName]["data"] = action.data(lastWorkShedule[action.tableName]["data"]);
				}else{
					newstate[action.tableName]["data"] = action.data;
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setKey': {
			if(action.tableName&&action.key&&Object.keys(lastWorkShedule).includes(action.tableName)){
				let newstate={...lastWorkShedule};
				if(typeof action.key === "function"){
					newstate[action.tableName]["key"] = action.key(lastWorkShedule[action.tableName]["key"]);
				}else{
					newstate[action.tableName]["key"] = action.key;
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
