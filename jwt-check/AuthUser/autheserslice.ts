// TODO: the interface and init values are not final, flesh this out when working the authentication piece
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IAuthUserState {
	error: any
	isLoading: boolean
	isAuthenticated: any
	authtoken:string
	firstName: string
	lastName: string
	email: string
}

const initialState: IAuthUserState = {
	error: null,
	isLoading: false,
	isAuthenticated: {auth:false}, 
	authtoken: '',
	firstName: '',
	lastName: '',
	email: '',
}

export const authUserSlice = createSlice({
	name: 'authUser',
	initialState,
	reducers: {
		_login: (state, action: PayloadAction<boolean>) => {
			
			state.isAuthenticated = action.payload
		},
		incrementByAmount: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload
		},_setauthtoken: (state, action: PayloadAction<string>) => {
			state.authtoken = action.payload
		},
		_logout: (state) => {
			state.isAuthenticated = {auth:false}
			state.authtoken = ''
			state.firstName = ''
			state.lastName = ''
			state.email = ''
 		}
	},
	extraReducers: {},
})


// export const authUserReducer = authUserSlice.reducer



export const { _login, incrementByAmount,_setauthtoken ,_logout} = authUserSlice.actions;
export const authUserReducer = authUserSlice.reducer