import React from "react";
import { Layout } from "antd";
import Header from "@/components/layout/client/header";
import { Outlet } from "react-router-dom";
import ChatBotComponent from "@/pages/chat/ChatBot";
import CustomerSupportChat from "@/pages/chat/CustomerSupportChat";

const { Content } = Layout;

const ClientLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Content>
                <Outlet />
                <ChatBotComponent />
                <CustomerSupportChat />
            </Content>
        </Layout>
    );
};

export default ClientLayout;
