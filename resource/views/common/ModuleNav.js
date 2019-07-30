/**
 * Định nghĩa các stack điều hướng dùng cho App
 * author: Ant
 * date: 30/07/19
 */

import { StackNavigator } from 'react-navigation';

//#region màn hình văn bản đi
import VanBanDiIsNotProcessList from '../modules/VanBanDi/IsNotProcessList';
import VanBanDiIsProcessList from '../modules/VanBanDi/IsProcessList';
import VanBanDiJoinProcessList from '../modules/VanBanDi/JoinProcessList';
import VanBanDiIsPublishList from '../modules/VanBanDi/IsPublishList';
import VanBanDiSearchList from '../modules/VanBanDi/SearchList';
import VanBanDiDetail from '../modules/VanBanDi/Detail';
//#endregion

//#region màn hình văn bản đến
import VanBanDenIsNotProcessList from '../modules/VanBanDen/IsNotProcessList';
import VanBanDenIsProcessList from '../modules/VanBanDen/IsProcessList';
import VanBanDenJoinProcessList from '../modules/VanBanDen/JoinProcessList';
import VanBanDenInternalProcessList from '../modules/VanBanDen/InternalProcessList';
import VanBanDenInternalNotProcessList from '../modules/VanBanDen/InternalNotProcessList';
import VanBanDenSearchList from '../modules/VanBanDen/SearchList';
import VanBanDenDetail from '../modules/VanBanDen/Detail';
import VanBanDenBrief from '../modules/VanBanDen/Brief';
//#endregion

//#region màn hình công việc
import ListAssignedTask from '../modules/Task/ListAssignedTask';
import ListCombinationTask from '../modules/Task/ListCombinationTask';
import ListPersonalTask from '../modules/Task/ListPersonalTask';
import ListProcessedTask from '../modules/Task/ListProcessedTask';
import ListPendingConfirmTask from '../modules/Task/ListPendingConfirmTask';
import ListFilterTask from '../modules/Task/ListFilterTask';
import DetailTask from '../modules/Task/DetailTask';
import AssignTask from '../modules/Task/AssignTask';
import AssignTaskUsers from '../modules/Task/AssignTaskUsers';
import RescheduleTask from '../modules/Task/RescheduleTask';
import UpdateProgressTask from '../modules/Task/UpdateProgressTask';
import ApproveProgressTask from '../modules/Task/ApproveProgressTask';
import EvaluationTask from '../modules/Task/EvaluationTask';
import HistoryRescheduleTask from '../modules/Task/HistoryRescheduleTask';
import HistoryProgressTask from '../modules/Task/HistoryProgressTask';
import ApproveEvaluationTask from '../modules/Task/ApproveEvaluationTask';
import CreateSubTask from '../modules/Task/CreateSubTask';
import HistoryEvaluateTask from '../modules/Task/HistoryEvaluateTask';
import GroupSubTask from '../modules/Task/GroupSubTask';
import ApproveRescheduleTask from '../modules/Task/ApproveRescheduleTask';
import DenyRescheduleTask from '../modules/Task/DenyRescheduleTask';
//#endregion

//#region đăng nhập + đăng ký + truy vấn tài khoản
import Login from '../modules/User/Login';
import Signup from '../modules/User/Signup';
import AccountInfo from '../modules/User/AccountInfo';
import AccountEditor from '../modules/User/AccountEditor';
import AccountChangePassword from '../modules/User/AccountChangePassword';
//#endregion

import Loading from '../common/Loading';
//sidebar
import SideBar from './SideBar';
import Dashboard from './Dashboard';

//#region màn hình luồng xử lý công việc
import WorkflowReplyReview from '../modules/Workflow/WorkflowReplyReview';
import WorkflowRequestReview from '../modules/Workflow/WorkflowRequestReview';
import WorkflowStreamProcess from '../modules/Workflow/WorkflowStreamProcess';
import WorkflowStreamProcessUsers from '../modules/Workflow/WorkflowStreamProcessUsers';
import WorkflowRequestReviewUsers from '../modules/Workflow/WorkflowRequestReviewUsers';
//#endregion

//comment
import ListComment from '../modules/Comment/ListComment';
import ReplyComment from '../modules/Comment/ReplyComment';

//chat
import ListChatter from '../modules/Chat/ListChatter';
import Chatter from '../modules/Chat/Chatter';
import DetailChatter from '../modules/Chat/DetailChatter';

//màn hình thông báo
import ListNotification from '../modules/Notification/ListNotification';

//test
//import { TestFCM as Test, TestNav } from '../../common/Test';

//search
import CalendarPicker from '../modules/AdvancedSearch/CalendarPicker';

//#region Lịch công tác
import BaseCalendar from '../modules/LichCongTac/BaseCalendar';
import EventList from '../modules/LichCongTac/EventList';
import DetailEvent from '../modules/LichCongTac/Detail';

//màn hình ủy quyền
import ListUyQuyen from '../modules/UyQuyen/ListUyQuyen';
import EditUyQuyen from '../modules/UyQuyen/EditUyQuyen';
import DeptUyQuyen from '../modules/UyQuyen/DeptUyQuyen';
//#endregion

const notificationStack = StackNavigator(
  {
    VanBanDiIsNotProcessScreen: {
      screen: VanBanDiIsNotProcessList
    },
    VanBanDiIsProcessScreen: {
      screen: VanBanDiIsProcessList
    },
    VanBanDiJoinProcessScreen: {
      screen: VanBanDiJoinProcessList
    },
    VanBanDiIsPublishScreen: {
      screen: VanBanDiIsPublishList
    },
    VanBanDiSearchScreen: {
      screen: VanBanDiSearchList
    },
    VanBanDiDetailScreen: {
      screen: VanBanDiDetail
    },
    VanBanDenIsNotProcessScreen: {
      screen: VanBanDenIsNotProcessList
    },
    VanBanDenIsProcessScreen: {
      screen: VanBanDenIsProcessList
    },
    VanBanDenJoinProcessScreen: {
      screen: VanBanDenJoinProcessList
    },
    VanBanDenInternalIsNotProcessScreen: {
      screen: VanBanDenInternalNotProcessList
    },
    VanBanDenInternalIsProcessScreen: {
      screen: VanBanDenInternalProcessList
    },
    VanBanDenSearchScreen: {
      screen: VanBanDenSearchList
    },
    VanBanDenDetailScreen: {
      screen: VanBanDenDetail
    },
    VanBanDenBriefScreen: {
      screen: VanBanDenBrief
    },
    WorkflowStreamProcessScreen: {
      screen: WorkflowStreamProcess
    },
    ListAssignedTaskScreen: {
      screen: ListAssignedTask
    },
    ListCombinationTaskScreen: {
      screen: ListCombinationTask
    },
    ListPersonalTaskScreen: {
      screen: ListPersonalTask
    },
    ListProcessedTaskScreen: {
      screen: ListProcessedTask
    },
    ListPendingConfirmTaskScreen: {
      screen: ListPendingConfirmTask
    },
    ListFilterTaskScreen: {
      screen: ListFilterTask
    },
    DetailTaskScreen: {
      screen: DetailTask
    },
    AssignTaskScreen: {
      screen: AssignTask
    }, AssignTaskUsersScreen: {
      screen: AssignTaskUsers
    },
    RescheduleTaskScreen: {
      screen: RescheduleTask
    },
    UpdateProgressTaskScreen: {
      screen: UpdateProgressTask
    },
    ApproveProgressTaskScreen: {
      screen: ApproveProgressTask
    },
    EvaluationTaskScreen: {
      screen: EvaluationTask
    },
    HistoryEvaluateTaskScreen: {
      screen: HistoryEvaluateTask
    },
    ApproveEvaluationTaskScreen: {
      screen: ApproveEvaluationTask
    },
    HistoryRescheduleTaskScreen: {
      screen: HistoryRescheduleTask
    },
    HistoryProgressTaskScreen: {
      screen: HistoryProgressTask
    },
    GroupSubTaskScreen: {
      screen: GroupSubTask
    },
    CreateSubTaskScreen: {
      screen: CreateSubTask
    },
    WorkflowReplyReviewScreen: {
      screen: WorkflowReplyReview
    },
    WorkflowRequestReviewScreen: {
      screen: WorkflowRequestReview
    },
    WorkflowRequestReviewUsersScreen: {
      screen: WorkflowRequestReviewUsers
    },
    WorkflowStreamProcessUsersScreen: {
      screen: WorkflowStreamProcessUsers
    },
    ListCommentScreen: {
      screen: ListComment
    },
    ReplyCommentScreen: {
      screen: ReplyComment
    }, ApproveRescheduleTaskScreen: {
      screen: ApproveRescheduleTask
    }, DenyRescheduleTaskScreen: {
      screen: DenyRescheduleTask
    },

    ListChatterScreen: {
      screen: ListChatter
    }, ChatterScreen: {
      screen: Chatter
    },
    DetailChatterScreen: {
      screen: DetailChatter
    },

    BaseCalendarScreen: {
      screen: BaseCalendar
    },
    EventListScreen: {
      screen: EventList
    },
    DetailEventScreen: {
      screen: DetailEvent
    },
    ListUyQuyenScreen: {
      screen: ListUyQuyen
    },
    EditUyQuyenScreen: {
      screen: EditUyQuyen
    }, DeptUyQuyenScreen: {
      screen: DeptUyQuyen
    },
    ListNotificationScreen: {
      screen: ListNotification
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'ListNotificationScreen'
  }
);

const dashboardStack = StackNavigator(
  {
    VanBanDiIsNotProcessScreen: {
      screen: VanBanDiIsNotProcessList
    },
    VanBanDiIsProcessScreen: {
      screen: VanBanDiIsProcessList
    },
    VanBanDiJoinProcessScreen: {
      screen: VanBanDiJoinProcessList
    },
    VanBanDiIsPublishScreen: {
      screen: VanBanDiIsPublishList
    },
    VanBanDiSearchScreen: {
      screen: VanBanDiSearchList
    },
    VanBanDiDetailScreen: {
      screen: VanBanDiDetail
    },
    VanBanDenIsNotProcessScreen: {
      screen: VanBanDenIsNotProcessList
    },
    VanBanDenIsProcessScreen: {
      screen: VanBanDenIsProcessList
    },
    VanBanDenJoinProcessScreen: {
      screen: VanBanDenJoinProcessList
    },
    VanBanDenInternalIsNotProcessScreen: {
      screen: VanBanDenInternalNotProcessList
    },
    VanBanDenInternalIsProcessScreen: {
      screen: VanBanDenInternalProcessList
    },
    VanBanDenSearchScreen: {
      screen: VanBanDenSearchList
    },
    VanBanDenDetailScreen: {
      screen: VanBanDenDetail
    },
    VanBanDenBriefScreen: {
      screen: VanBanDenBrief
    },
    WorkflowStreamProcessScreen: {
      screen: WorkflowStreamProcess
    },
    ListAssignedTaskScreen: {
      screen: ListAssignedTask
    },
    ListCombinationTaskScreen: {
      screen: ListCombinationTask
    },
    ListPersonalTaskScreen: {
      screen: ListPersonalTask
    },
    ListProcessedTaskScreen: {
      screen: ListProcessedTask
    },
    ListPendingConfirmTaskScreen: {
      screen: ListPendingConfirmTask
    },
    ListFilterTaskScreen: {
      screen: ListFilterTask
    },
    DetailTaskScreen: {
      screen: DetailTask
    },
    AssignTaskScreen: {
      screen: AssignTask
    }, AssignTaskUsersScreen: {
      screen: AssignTaskUsers
    },
    RescheduleTaskScreen: {
      screen: RescheduleTask
    },
    UpdateProgressTaskScreen: {
      screen: UpdateProgressTask
    },
    ApproveProgressTaskScreen: {
      screen: ApproveProgressTask
    },
    EvaluationTaskScreen: {
      screen: EvaluationTask
    },
    HistoryEvaluateTaskScreen: {
      screen: HistoryEvaluateTask
    },
    ApproveEvaluationTaskScreen: {
      screen: ApproveEvaluationTask
    },
    HistoryRescheduleTaskScreen: {
      screen: HistoryRescheduleTask
    },
    HistoryProgressTaskScreen: {
      screen: HistoryProgressTask
    },
    GroupSubTaskScreen: {
      screen: GroupSubTask
    },
    CreateSubTaskScreen: {
      screen: CreateSubTask
    },
    WorkflowReplyReviewScreen: {
      screen: WorkflowReplyReview
    },
    WorkflowRequestReviewScreen: {
      screen: WorkflowRequestReview
    },
    WorkflowRequestReviewUsersScreen: {
      screen: WorkflowRequestReviewUsers
    },
    WorkflowStreamProcessUsersScreen: {
      screen: WorkflowStreamProcessUsers
    },
    ListCommentScreen: {
      screen: ListComment
    },
    ReplyCommentScreen: {
      screen: ReplyComment
    }, ApproveRescheduleTaskScreen: {
      screen: ApproveRescheduleTask
    }, DenyRescheduleTaskScreen: {
      screen: DenyRescheduleTask
    },

    ListChatterScreen: {
      screen: ListChatter
    }, ChatterScreen: {
      screen: Chatter
    },
    DetailChatterScreen: {
      screen: DetailChatter
    },

    BaseCalendarScreen: {
      screen: BaseCalendar
    },
    EventListScreen: {
      screen: EventList
    },
    DetailEventScreen: {
      screen: DetailEvent
    },
    ListUyQuyenScreen: {
      screen: ListUyQuyen
    },
    EditUyQuyenScreen: {
      screen: EditUyQuyen
    }, DeptUyQuyenScreen: {
      screen: DeptUyQuyen
    },
    DashboardScreen: {
      screen: Dashboard
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'DashboardScreen'
  }
);

const accountStack = StackNavigator(
  {
    AccountInfoScreen: {
      screen: AccountInfo
    }, AccountEditorScreen: {
      screen: AccountEditor
    }, AccountChangePasswordScreen: {
      screen: AccountChangePassword
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'AccountInfoScreen'
  }
);

const authStack = StackNavigator(
  {
    LoginScreen: {
      screen: Login
    },
    SignupScreen: {
      screen: Signup
    }
  },
  {
    headerMode: 'none',
  }
);


export {
  notificationStack,
  dashboardStack,
  accountStack,
  authStack
}