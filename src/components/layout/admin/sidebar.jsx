import { AppstoreOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth.context";

const Sidebar = () => {
    let items = [];
    const { user } = useContext(AuthContext);
    if (user.role.name === "ADMIN") {
        items = [
            {
                label: 'Navigation One',
                key: 'user',
                icon: <UserOutlined />,
            }
        ];
    } else {
        items = [
            {
                label: 'Navigation One',
                key: 'user',
                icon: <UserOutlined />,
            },
            {
                label: 'Navigation Two',
                key: 'app',
                icon: <AppstoreOutlined />,
                disabled: true,
            },
            {
                label: 'Navigation Three - Submenu',
                key: 'SubMenu',
                icon: <SettingOutlined />,
                children: [
                    {
                        type: 'group',
                        label: 'Item 1',
                        children: [
                            { label: 'Option 1', key: 'setting:1' },
                            { label: 'Option 2', key: 'setting:2' },
                        ],
                    },
                    {
                        type: 'group',
                        label: 'Item 2',
                        children: [
                            { label: 'Option 3', key: 'setting:3' },
                            { label: 'Option 4', key: 'setting:4' },
                        ],
                    },
                ],
            },
            {
                key: 'alipay',
                label: (
                    <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                        Navigation Four - Link
                    </a>
                ),
            },
        ];
    }

    const [current, setCurrent] = useState('user');
    const onClick = e => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />;
}

export default Sidebar;