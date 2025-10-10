import React from "react";
import { Layout } from "antd";
import Header from "@/components/layout/client/header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const ClientLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default ClientLayout;
