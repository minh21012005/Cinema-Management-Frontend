import {
    BankOutlined, BarChartOutlined, DashboardOutlined, SearchOutlined, SettingOutlined,
    ShopOutlined, ShoppingCartOutlined, UserOutlined, VideoCameraOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    let items = [];
    const { user } = useContext(AuthContext);
    const nav = useNavigate();

    let defaultKey = "user";
    if (user.role.name === "MANAGER") {
        defaultKey = "cinema-management";
    } else if (user.role.name === "STAFF") {
        defaultKey = "dashboard";
    }

    if (user.role.name === "ADMIN") {
        items = [
            {
                label: 'User',
                key: 'user',
                icon: <UserOutlined />,
            }
        ];
    } else if (user.role.name === "MANAGER") {
        items = [
            {
                label: 'Cinema Management',
                key: 'cinema-management',
                icon: <BankOutlined />,
                onClick: () => { nav('/manager'); }
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
                            { label: 'Movie', key: 'movie' },
                            { label: 'Category', key: 'category' },
                            { label: 'Rating', key: 'rating' },
                        ],
                    },
                    {
                        type: 'group',
                        label: 'Showtime',
                        children: [
                            { label: 'Showtime', key: 'showtime' },
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
                            { label: 'Food', key: 'food' },
                            { label: 'Combo', key: 'combo' },
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
                            { label: 'Ticket Report', key: 'ticket-report' },
                            { label: 'Food Report', key: 'food-report' },
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
                            { label: 'Staff List', key: 'staff' },
                        ],
                    },
                ],
            },
            {
                label: 'Settings',
                key: 'settings',
                icon: <SettingOutlined />,
            },
        ];
    } else if (user.role.name === "STAFF") {
        items = [
            {
                label: 'Dashboard',
                key: 'dashboard',
                icon: <DashboardOutlined />,
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
                            { label: 'Sell Ticket', key: 'sell-ticket' },
                            { label: 'Manage Tickets', key: 'manage-tickets' },
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
                            { label: 'Sell Food/Combo', key: 'sell-food' },
                            { label: 'Manage Orders', key: 'manage-orders' },
                        ],
                    },
                ],
            },
            {
                label: 'Customer Lookup',
                key: 'customer-lookup',
                icon: <SearchOutlined />,
            },
        ];
    }

    const [current, setCurrent] = useState(defaultKey);
    const onClick = e => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />;
}

export default Sidebar;