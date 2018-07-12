import * as type from './NetworkActionType';

export const updateNetworkStatus = (status) => ({
    type: type.UPDATE_NETWORK_STATUS,
    status
})