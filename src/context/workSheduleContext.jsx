import { createContext, useContext, useReducer } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
const WorkSheduleContext = createContext(null);

const WorkSheduleDispatchContext = createContext(null);
import axios from "axios";

const initialWorkShedulestate = {
	people:{
		columns:[
			{
				title: '姓名',
				dataIndex: 'name',
				default:"新员工",
			},
			{
				title: '资质',
				dataIndex: 'qualification',
				type:"list",
				default:[],
			},
			{
				title:"等价组",
				dataIndex:"equalGroup", 
				type:"select",
				default:null,
				description:"同组的成员班表顺序一样，但可能会错开在不同天；不同组互不影响"
			},
		],
		key:0,
		data:[]
	},
	shifts:{
		columns:[
			{
				title: '班名称',
				dataIndex: 'name',
				default:"新班",
			},
			{
				title: '上班人数',
				dataIndex: 'peopleNeedCount',
				type:"range",
				default:[1,1],
				get max(){
					return initialWorkShedulestate.people.data.length;
				}
			},
			{
				title: '班时长',
				dataIndex: 'length',
				type:"number",
				default:1,
				description:"此班所算工时"
			},
			{
				title: '所需上班天数',
				dataIndex: 'bancount',
				type:"number",
				default:1,
			},
			{
				title: '最短连续天数',
				dataIndex: 'minlength',
				type:"number",
				default:0,
			},
			{
				title: '最大连续天数',
				dataIndex: 'maxlength',
				type:"number",
				default:4,
			},
		],
		key:0,
		data:[]
	},
	dependency:{
		equalGroup:{
			used:"people",
			value:[
				"第一小队",
				"第二小队",
				"第三小队",
			]
		},
		qualification:{
			used:"people",
			value:[
				"CCNA",
				"CCNP",
				"CCIE"
			]
		}
	},
	config:{
		template:{
			offday_config:{
				"title":"休息日设置",
				children:[
					{
						title: '最短连续天数',
						type: Number,
						name:"minlength",
					},
					{
						title: '最大连续天数',
						type: Number,
						name:"maxlength"
					},
				]
				
			},
		},
		data:{
			offday_config:{
				"minlength":2,
				"maxlength":8,
			},
		}
	},
	day:{
		range:[dayjs(),dayjs()],
		get input_num_days(){
			return Math.abs(this.range[0].diff(this.range[1],"day"));
		},
	},
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
		case 'setDependency':{
			if(action.key&&Object.keys(lastWorkShedule.dependency).includes(action.key)){
				let newstate={...lastWorkShedule};
				if(Array.isArray(newstate.dependency[action.key].value)){
					if(typeof action.index === 'number'){
						newstate.dependency[action.key].value[action.index]=action.value;
					}else{
						newstate.dependency[action.key].value=action.value;
						newstate[newstate.dependency[action.key].used].data=newstate[newstate.dependency[action.key].used].data.map(v=>{
							let newret={...v};
							newret[action.key]=[];
							return newret;
						})
					}
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setinput_num_days':{
			if(typeof action.data == 'number'){
				let newstate={...lastWorkShedule};
				newstate.input_num_days = action.data;
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setday':{
			if(Array.isArray(action.data)&&action.data.length==2&&dayjs.isDayjs(action.data[0])&&dayjs.isDayjs(action.data[1])){
				let newstate={...lastWorkShedule};
				newstate.day.range = action.data;
				return newstate;
			}
			return lastWorkShedule;
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
