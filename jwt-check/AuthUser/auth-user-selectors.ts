import { RootState } from '..'
import { IAuthUser } from '../../types'

export const selectAuthedUser = (state: RootState): IAuthUser | null => {
	if (!state.authUser.isAuthenticated) {
		return null
	}

	return {
		firstName: state.authUser.firstName,
		lastName: state.authUser.lastName,
		email: state.authUser.email,
		isAuthanticate:state.authUser.isAuthenticated,
		authtoken:state.authUser.authtoken

	}
}
