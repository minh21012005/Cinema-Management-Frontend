import { createRoot } from 'react-dom/client'
import LoginPage from './pages/login.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import PrivateRouteAdmin from './pages/admin/private.route.admin.jsx';
import ErrorPage from './pages/error.jsx';
import PrivateRouteManager from './pages/manager/private.route.manager.jsx';
import PrivateRouteStaff from './pages/staff/private.route.manager.jsx';
import ManagerLayout from './pages/manager/index.jsx';
import CinemaListPage from './pages/manager/cinema.list.jsx';
import RoomListPage from './pages/manager/room.list.jsx';
import SeatListPage from './pages/manager/seat.list.jsx';
import RoomCreate from './pages/manager/room.create.jsx';
import MovieListPage from './pages/manager/movie.list.jsx';
import ShowTimeListPage from './pages/manager/showtime.list.jsx';
import FoodListPage from './pages/manager/food.list.jsx';
import ComboListPage from './pages/manager/combo.list.jsx';
import AdminLayout from './pages/admin/index.jsx';
import RoleListPage from './pages/admin/role.list.jsx';
import UserPage from './pages/admin/user.list.jsx';
import PermissionListPage from './pages/admin/permission.list.jsx';
import SellTicketPage from './pages/staff/ticket.sell.jsx';
import StaffLayout from './pages/staff/index.jsx';
import VerifyOtpPage from './pages/verify.otp.jsx';
import BannerListPage from './pages/manager/banner.list.jsx';
import MovieDetailPage from './pages/client/MovieDetailPage.jsx';
import ClientLayout from './components/layout/client/ClientLayout.jsx';
import HomePage from './pages/client/homepage.jsx';
import SeatBooking from './pages/client/booking.jsx';
import PrivateRouteClient from './pages/client/private.route.client.jsx';
import PrivateRouteSupport from './pages/support/private.route.support.jsx';
import SupportLayout from './pages/support/index.jsx';
import ChatSessionListPage from './pages/support/chat.session.list.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "booking/:id",
        element: <MovieDetailPage />,
      },
      {
        path: "booking/:id/seats",
        element:
          <PrivateRouteClient>
            <SeatBooking />
          </PrivateRouteClient>
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRouteAdmin>
        <AdminLayout />
      </PrivateRouteAdmin>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <UserPage />  // Trang mặc định
      },
      {
        path: "roles",
        element: <RoleListPage />   // Trang quản lý Role
      },
      {
        path: "permissions",
        element: <PermissionListPage /> // Trang quản lý Permission
      }
    ]
  },
  {
    path: "/manager",
    element: (
      <PrivateRouteManager>
        <ManagerLayout />
      </PrivateRouteManager>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CinemaListPage />,
      },
      {
        path: "cinemas/:id/rooms",
        element: <RoomListPage />,
      },
      {
        path: "cinemas/rooms/:id/seats",
        element: <SeatListPage />,
      },
      {
        path: "cinemas/:id/rooms/create",
        element: <RoomCreate />,
      },
      {
        path: "movies",
        element: <MovieListPage />,
      },
      {
        path: "cinemas/:id/showtime",
        element: <ShowTimeListPage />,
      },
      {
        path: "foods",
        element: <FoodListPage />,
      },
      {
        path: "combos",
        element: <ComboListPage />,
      },
      {
        path: "banners",
        element: <BannerListPage />,
      },
    ],
  },
  {
    path: "/staff",
    element: (
      <PrivateRouteStaff>
        <StaffLayout />
      </PrivateRouteStaff>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SellTicketPage />,
      },
    ],
  },
  {
    path: "/support",
    element: (
      <PrivateRouteSupport>
        <SupportLayout />
      </PrivateRouteSupport>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ChatSessionListPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
  {
    path: "/404",
    element: <ErrorPage />,
  }
]);

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    < RouterProvider router={router} />
  </AuthWrapper>,
)
