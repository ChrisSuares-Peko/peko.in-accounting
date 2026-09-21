import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import type { RootState } from '@store/store';

export type DataMode = 'dummy' | 'empty';

interface DataModeState {
    mode: DataMode;
}

const initialState: DataModeState = {
    mode: 'dummy',
};

const dataModeSlice = createSlice({
    name: 'dataMode',
    initialState,
    reducers: {
        toggleDataMode: state => {
            state.mode = state.mode === 'dummy' ? 'empty' : 'dummy';
        },
        setDataMode: (state, action: PayloadAction<DataMode>) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleDataMode, setDataMode } = dataModeSlice.actions;
export const selectDataMode = (state: RootState): DataMode => state.reducer.dataMode.mode;
export default dataModeSlice.reducer;
