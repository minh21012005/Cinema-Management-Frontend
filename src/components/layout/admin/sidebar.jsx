import {
    ApartmentOutlined, BankOutlined, CustomerServiceOutlined, DashboardOutlined, LockOutlined,
    SearchOutlined, SettingOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined, VideoCameraOutlined
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
        { pattern: /^\/manager$/, key: "dashboard" },
        { pattern: /^\/manager\/cinemas/, key: "cinema-management" },
        { pattern: /^\/manager\/movies/, key: "movie" },
        { pattern: /^\/manager\/rating/, key: "rating" },
        { pattern: /^\/manager\/foods/, key: "food" },
        { pattern: /^\/manager\/combo/, key: "combo" },
        { pattern: /^\/manager\/banners/, key: "banner" },
        { pattern: /^\/manager\/staff/, key: "staff" },
        { pattern: /^\/manager\/settings/, key: "settings" },
        { pattern: /^\/manager\/dashboard/, key: "cinema-management" },
        { pattern: /^\/staff/, key: "selling" },
        { pattern: /^\/customer-lookup/, key: "customer-lookup" },
        { pattern: /^\/admin$/, key: "user" },
        { pattern: /^\/support$/, key: "support-chat" },
        { pattern: /^\/admin\/roles/, key: "role" },
        { pattern: /^\/admin\/permissions/, key: "permission" },
    ], []);

    const matched = pathToKey.find(p => p.pattern.test(location.pathname));
    const selectedKey = matched ? matched.key : "dashboard";

    if (user.role.name === "ADMIN") {
        items = [
            {
                label: 'User',
                key: 'user',
                icon: <UserOutlined />,
                onClick: () => nav('/admin'),
            },
            {
                label: 'Role',
                key: 'role',
                icon: <ApartmentOutlined />,
                onClick: () => nav('/admin/roles'),
            },
            {
                label: 'Permission',
                key: 'permission',
                icon: <LockOutlined />,
                onClick: () => nav('/admin/permissions'),
            },
        ];
    } else if (user.role.name === "MANAGER") {
        items = [
            {
                label: 'Dashboard',
                key: 'dashboard',
                icon: <DashboardOutlined />,
                onClick: () => nav('/manager')
            },
            {
                label: 'Cinema Management',
                key: 'cinema-management',
                icon: <BankOutlined />,
                onClick: () => nav('/manager/cinemas')
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
                            { label: 'Combo', key: 'combo', onClick: () => nav('/manager/combos') },
                        ],
                    },
                ],
            },
            {
                label: 'Content',
                key: 'content',
                icon: <VideoCameraOutlined />, // Có thể thay icon khác nếu muốn
                children: [
                    {
                        type: 'group',
                        label: 'Content Management',
                        children: [
                            { label: 'Banner', key: 'banner', onClick: () => nav('/manager/banners') },
                            // Sau này có thể thêm các item con khác như: Promotion, Event, News...
                        ]
                    }
                ]
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
                label: 'Selling',
                key: 'selling',
                icon: <ShoppingCartOutlined />,
            },
            {
                label: 'Manage Orders',
                key: 'manage-orders',
                icon: <ShopOutlined />,
            },
            {
                label: 'Customer Lookup',
                key: 'customer-lookup',
                icon: <SearchOutlined />,
                onClick: () => nav('/customer-lookup')
            },
        ];
    }
    else if (user.role.name === "SUPPORT") {
        items = [
            {
                label: 'Chat Support',
                key: 'support-chat',
                icon: <CustomerServiceOutlined />,
                onClick: () => nav('/support')
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
