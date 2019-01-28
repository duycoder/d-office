import * as type from './ActionType';

export const updateNetworkStatus = (status) => ({
    type: type.UPDATE_NETWORK_STATUS,
    status
})