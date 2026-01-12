import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  draftTitle: string;
  draftContent: string;
}

const initialState: EditorState = {
  draftTitle: '',
  draftContent: ''
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setDraftTitle(state, action: PayloadAction<string>) {
      state.draftTitle = action.payload;
    },
    setDraftContent(state, action: PayloadAction<string>) {
      state.draftContent = action.payload;
    }
  }
});

export const { setDraftTitle, setDraftContent } = editorSlice.actions;
export default editorSlice.reducer;
