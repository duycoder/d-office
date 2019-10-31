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
import HistoryPlanTask from '../modules/Task/HistoryPlanTask';
import ApproveEvaluationTask from '../modules/Task/ApproveEvaluationTask';
import CreateSubTask from '../modules/Task/CreateSubTask';
import HistoryEvaluateTask from '../modules/Task/HistoryEvaluateTask';
import GroupSubTask from '../modules/Task/GroupSubTask';
import ApproveRescheduleTask from '../modules/Task/ApproveRescheduleTask';
import DenyRescheduleTask from '../modules/Task/DenyRescheduleTask';
import CreateTask from '../modules/Task/CreateTask';
import CreateTaskPlan from '../modules/Task/CreateTaskPlan';
import ConfirmTaskPlan from '../modules/Task/ConfirmTaskPlan';
import PickTaskAssigner from '../modules/Task/PickTaskAssigner';
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
import KeyFunction from './KeyFunction';
import ExtendKeyFunction from './ExtendKeyFunction';

//#region màn hình luồng xử lý công việc
import WorkflowReplyReview from '../modules/Workflow/WorkflowReplyReview';
import WorkflowRequestReview from '../modules/Workflow/WorkflowRequestReview';
import WorkflowStreamProcess from '../modules/Workflow/WorkflowStreamProcess';
import WorkflowStreamProcessUsers from '../modules/Workflow/WorkflowStreamProcessUsers';
import WorkflowRequestReviewUsers from '../modules/Workflow/WorkflowRequestReviewUsers';
//#endregion

//#region màn hình đăng ký & quản lý chuyến xe
import ListCarRegistration from '../modules/CarRegistration/ListRegistration';
import CreateRegistration from '../modules/CarRegistration/CreateRegistration';
import DetailRegistration from '../modules/CarRegistration/DetailRegistration';
import ListTrip from '../modules/CarRegistration/ListTrip';
import CreateTrip from '../modules/CarRegistration/CreateTrip';
import RejectTrip from '../modules/CarRegistration/RejectTrip';
import DetailTrip from '../modules/CarRegistration/DetailTrip';
import ReturnTrip from '../modules/CarRegistration/ReturnTrip';
import PickCanbo from '../modules/CarRegistration/PickCanbo';
//#endregion

//#region màn hình lịch trực/ lịch khám
import ListLichtruc from '../modules/LichTruc/ListLichtruc';
//#endregion

//#region màn hình lịch họp/ phòng họp
import MeetingDayList from '../modules/MeetingRoom/MeetingDayList';
import DetailMeetingDay from '../modules/MeetingRoom/DetailMeetingDay';
import PickMeetingRoom from '../modules/MeetingRoom/PickMeetingRoom';
import CreateMeetingDay from '../modules/MeetingRoom/CreateMeetingDay';
import PickNguoiChutri from '../modules/MeetingRoom/PickNguoiChutri';
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
import CreateNotiUyQuyen from '../modules/Notification/CreateNotiUyQuyen';
import DetailNotiUyQuyen from '../modules/Notification/DetailNotiUyQuyen';

//#region tính năng chuyên biệt (không biết xếp vào đâu)
import ListReminder from '../modules/Miscs/ListReminder';
import CreateReminder from '../modules/Miscs/CreateReminder';
import WebViewer from '../modules/Miscs/WebViewer';
//#endregion

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

//stack gốc phục vụ StackNavigator
const baseStack = {
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
  CreateTaskScreen: {
    screen: CreateTask
  },
  CreateTaskPlanScreen: {
    screen: CreateTaskPlan
  },
  ConfirmTaskPlanScreen: {
    screen: ConfirmTaskPlan
  },
  PickTaskAssignerScreen: {
    screen: PickTaskAssigner
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
  HistoryPlanTaskScreen: {
    screen: HistoryPlanTask
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
  ListCarRegistrationScreen: {
    screen: ListCarRegistration
  }, CreateCarRegistrationScreen: {
    screen: CreateRegistration
  }, DetailCarRegistrationScreen: {
    screen: DetailRegistration
  }, CreateTripScreen: {
    screen: CreateTrip
  }, ListTripScreen: {
    screen: ListTrip
  }, RejectTripScreen: {
    screen: RejectTrip
  }, DetailTripScreen: {
    screen: DetailTrip
  }, ReturnTripScreen: {
    screen: ReturnTrip
  }, PickCanboScreen: {
    screen: PickCanbo
  },

  ListLichtrucScreen: {
    screen: ListLichtruc
  },

  MeetingDayListScreen: {
    screen: MeetingDayList
  }, DetailMeetingDayScreen: {
    screen: DetailMeetingDay
  }, PickMeetingRoomScreen: {
    screen: PickMeetingRoom
  }, CreateMeetingDayScreen: {
    screen: CreateMeetingDay
  }, PickNguoiChutriScreen: {
    screen: PickNguoiChutri
  },

  ListReminderScreen: {
    screen: ListReminder
  }, CreateReminderScreen: {
    screen: CreateReminder
  }, WebViewerScreen: {
    screen: WebViewer
  },

  CreateNotiUyQuyenScreen: {
    screen: CreateNotiUyQuyen
  }, DetailNotiUyQuyenScreen: {
    screen: DetailNotiUyQuyen
  },

  AccountInfoScreen: {
    screen: AccountInfo
  }, AccountEditorScreen: {
    screen: AccountEditor
  }, AccountChangePasswordScreen: {
    screen: AccountChangePassword
  },
};

const notificationStack = StackNavigator(
  {
    ...baseStack,
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
    ...baseStack,
    ExtendKeyFunctionScreen: {
      screen: ExtendKeyFunction
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

const keyFunctionStack = StackNavigator(
  {
    ...baseStack,
    KeyFunctionScreen: {
      screen: KeyFunction
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'KeyFunctionScreen'
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
  keyFunctionStack,
  accountStack,
  authStack
}