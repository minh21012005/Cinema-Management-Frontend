// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import HomePage from "./pages/client/homepage";

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
