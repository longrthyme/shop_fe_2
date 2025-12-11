import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import {AuthProvider} from "./AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Chọn ngôn ngữ nếu cần

// Nếu cần thêm plugin của dayjs:
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {WebSocketProvider} from "./WebSocketProvider";
import ScrollToTop from "./Backgroudwed/backgroudTrangChu/ScrollToTop";
import { message } from 'antd';
dayjs.extend(isSameOrAfter);


message.config({
    duration: 4, // default 4 seconds
    maxCount: 3, // only show 3 messages at once
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ScrollToTop />
        <WebSocketProvider>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </WebSocketProvider>
    </BrowserRouter>
);