import {
    BankOutlined, BarChartOutlined, DashboardOutlined, SearchOutlined, SettingOutlined,
    ShopOutlined, ShoppingCartOutlined, UserOutlined, VideoCameraOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/auth.context";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    let items = [];
    const { user } = useContext(AuthContext);
    const nav = useNavigate();
    const location = useLocation();

    // Map URL -> key (dùng regex để match cả sub-path)
    const pathToKey = useMemo(() => [
        { pattern: /^\/manager$/, key: "cinema-management" },
        { pattern: /^\/manager\/cinemas/, key: "cinema-management" },
        { pattern: /^\/manager\/movies/, key: "movie" },
        { pattern: /^\/manager\/rating/, key: "rating" },
        { pattern: /^\/manager\/foods/, key: "food" },
        { pattern: /^\/manager\/combo/, key: "combo" },
        { pattern: /^\/manager\/ticket-report/, key: "ticket-report" },
        { pattern: /^\/manager\/food-report/, key: "food-report" },
        { pattern: /^\/manager\/staff/, key: "staff" },
        { pattern: /^\/manager\/settings/, key: "settings" },
        { pattern: /^\/dashboard/, key: "dashboard" },
        { pattern: /^\/ticket/, key: "ticket" },
        { pattern: /^\/sell-ticket/, key: "sell-ticket" },
        { pattern: /^\/manage-tickets/, key: "manage-tickets" },
        { pattern: /^\/sell-food/, key: "sell-food" },
        { pattern: /^\/manage-orders/, key: "manage-orders" },
        { pattern: /^\/customer-lookup/, key: "customer-lookup" },
        { pattern: /^\/admin/, key: "user" },
    ], []);

    const matched = pathToKey.find(p => p.pattern.test(location.pathname));
    const selectedKey = matched ? matched.key : "dashboard";

    if (user.role.name === "ADMIN") {
        items = [
            {
                label: 'User',
                key: 'user',
                icon: <UserOutlined />,
                onClick: () => nav('/admin')
            }
        ];
    } else if (user.role.name === "MANAGER") {
        items = [
            {
                label: 'Cinema Management',
                key: 'cinema-management',
                icon: <BankOutlined />,
                onClick: () => nav('/manager')
            },
            {
                label: 'Movie Management',
                key: 'movie-management',
                icon: <VideoCameraOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Movies',
                        children: [
                            { label: 'Movie', key: 'movie', onClick: () => nav('/manager/movies') },
                            { label: 'Rating', key: 'rating', onClick: () => nav('/manager/rating') },
                        ],
                    },
                ],
            },
            {
                label: 'Concession',
                key: 'concession',
                icon: <ShopOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Food & Combo',
                        children: [
                            { label: 'Food', key: 'food', onClick: () => nav('/manager/foods') },
                            { label: 'Combo', key: 'combo', onClick: () => nav('/manager/combo') },
                        ],
                    },
                ],
            },
            {
                label: 'Reports',
                key: 'reports',
                icon: <BarChartOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Revenue Reports',
                        children: [
                            { label: 'Ticket Report', key: 'ticket-report', onClick: () => nav('/manager/ticket-report') },
                            { label: 'Food Report', key: 'food-report', onClick: () => nav('/manager/food-report') },
                        ],
                    },
                ],
            },
            {
                label: 'Staff Management',
                key: 'staff-management',
                icon: <UserOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Staff',
                        children: [
                            { label: 'Staff List', key: 'staff', onClick: () => nav('/manager/staff') },
                        ],
                    },
                ],
            },
            {
                label: 'Settings',
                key: 'settings',
                icon: <SettingOutlined />,
                onClick: () => nav('/manager/settings')
            },
        ];
    } else if (user.role.name === "STAFF") {
        items = [
            {
                label: 'Dashboard',
                key: 'dashboard',
                icon: <DashboardOutlined />,
                onClick: () => nav('/dashboard')
            },
            {
                label: 'Ticket',
                key: 'ticket',
                icon: <ShoppingCartOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Ticket Sales',
                        children: [
                            { label: 'Sell Ticket', key: 'sell-ticket', onClick: () => nav('/sell-ticket') },
                            { label: 'Manage Tickets', key: 'manage-tickets', onClick: () => nav('/manage-tickets') },
                        ],
                    },
                ],
            },
            {
                label: 'Food & Combo',
                key: 'food-combo',
                icon: <ShopOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Sales',
                        children: [
                            { label: 'Sell Food/Combo', key: 'sell-food', onClick: () => nav('/sell-food') },
                            { label: 'Manage Orders', key: 'manage-orders', onClick: () => nav('/manage-orders') },
                        ],
                    },
                ],
            },
            {
                label: 'Customer Lookup',
                key: 'customer-lookup',
                icon: <SearchOutlined />,
                onClick: () => nav('/customer-lookup')
            },
        ];
    }

    return (
        <Menu
            selectedKeys={[selectedKey]}
            mode="vertical"
            items={items}
        />
    );
};

export default Sidebar;
