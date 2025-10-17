import React from "react";
import { Layout } from "antd";
import Header from "@/components/layout/client/header";
import { Outlet } from "react-router-dom";
import ChatBotComponent from "@/pages/chatbot/ChatBot";

const { Content } = Layout;

const ClientLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Content>
                <Outlet />
                <ChatBotComponent />
            </Content>
        </Layout>
    );
};

export default ClientLayout;
