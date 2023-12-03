import { Action, createReducer, on } from '@ngrx/store';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { setItems } from './ingreso-egreso.actions';
import { unsetUser } from '../auth/auth.actions';
import { AppState } from '../app.reducer';

export interface State {
    items: IngresoEgreso[];
}

export interface AppStateWithIngresoEgreso extends AppState{
  ingresosEgresos: State
}

export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state, {items}) => ({ ...state, items: [...items]})),
    on(unsetUser, (state) => ({ ...state, items: []})),
);

export function ingresoEgresoReducer(state = initialState, action: Action) {
    return _ingresoEgresoReducer(state, action);
}

