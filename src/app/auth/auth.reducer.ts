import { createReducer, on, Action } from '@ngrx/store';
import * as auth from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario | null;
}

export const initialState: State = {
   user: null,
}

const _authReducer = createReducer(initialState,

    //user es el payload
    on(auth.setUser, (state, {user}) => ({ ...state, user: {...user}})),
    on(auth.unsetUser, (state) => ({ ...state, user: null})),

);

export function authReducer(state = initialState, action: Action) {
    return _authReducer(state, action);
}
