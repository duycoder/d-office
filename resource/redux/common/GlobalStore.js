
/**
 * @description: store chứa state của ứng dụng
 * @author: duynn
 * @since: 06/05/2018
 */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { globalReducer } from './GlobalReducer';

export const globalStore = createStore(globalReducer, applyMiddleware(thunk));