import { createContext, useContext, useReducer } from 'react';

const LoginContext = createContext(null);

const LoginDispatchContext = createContext(null);
import axios from "axios";


const initialloginstate = {};

export function LoginProvider({ children }) {
	const [login, dispatch] = useReducer(
		loginReducer,
		initialloginstate
	);

	return (
		<LoginContext.Provider value={login}>
			<LoginDispatchContext.Provider value={dispatch}>
				{children}
			</LoginDispatchContext.Provider>
		</LoginContext.Provider>
	);
}

export function useLogin() {
	return useContext(LoginContext);
}

export function useLoginDispatch() {
	return useContext(LoginDispatchContext);
}

function loginReducer(lastlogin, action) {
	switch (action.type) {
		case 'login': {
			if(action.token){
				axios.defaults.headers['Authorization']=action.token;
				return {
					token: action.token
				};
			}
			return lastlogin;
		}
		case 'logout': {
			return {};
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}