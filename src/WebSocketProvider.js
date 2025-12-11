import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from 'jwt-decode';


// Tạo context
const WebSocketContext = createContext(null);

// --- Các hàm tiện ích kiểm tra và làm mới token ---
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    } catch (e) {
        console.error("Lỗi khi giải mã token:", e);
        return true;
    }
};

const refreshToken = async () => {
    try {
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const response = await fetch('http://localhost:8022/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
        });
        if (!response.ok) throw new Error("Không thể làm mới token");
        const data = await response.json();
        // Lưu trữ token mới
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        return data.accessToken;
    } catch (e) {
        console.error("Lỗi khi làm mới token:", e);
        return null;
    }
};

const getValidToken = async () => {
    let token = localStorage.getItem("access_token");
    if (!token || isTokenExpired(token)) {
        console.log("Token hết hạn hoặc không tồn tại, đang làm mới...");
        token = await refreshToken();
        if (!token) {
            console.error("Không thể lấy token mới!");
        }
    }
    return token;
};
// --- Kết thúc các hàm tiện ích ---

export const WebSocketProvider = ({ children }) => {
    const websocket = useRef(null);
    let shouldReconnect = useRef(true);

    // Lưu tất cả tin nhắn server gửi về
    const [messages, setMessages] = useState([]);

    // Thông tin user
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);

    // Danh sách user (nếu admin quan tâm)
    const [userList, setUserList] = useState([]);

    // Nếu bạn cần chatHistories, tuỳ dự án
    const [chatHistories, setChatHistories] = useState({});
    const [allChats, setAllChats] = useState({});
    const saveChatToLocal = (history, userKey) => {
        localStorage.setItem("chatHistory_" + userKey, JSON.stringify(history));
    };

    const loadChatsFromLocal = () => {
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith("chatHistory_")
        );
        let restoredChats = {};
        keys.forEach((key) => {
            const username = key.replace("chatHistory_", "");
            restoredChats[username] = JSON.parse(localStorage.getItem(key));
        });
        return restoredChats;
    };
    // Hàm khởi tạo/kết nối WebSocket
    const connectWs = () => {
        console.log("[WebSocketProvider] >>> Attempting to connect...");

        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            console.log("[WebSocketProvider] WebSocket đã kết nối => Không cần connect nữa.");
            return;
        }

        const url = "ws://localhost:8022/api/ws";
        console.log("[WebSocketProvider] WebSocket URL =>", url);

        const ws = new WebSocket(url);
        websocket.current = ws;


        ws.onopen = async () => {
            console.log("[WebSocketProvider] (onopen) WebSocket kết nối thành công!");
            const token = await getValidToken();
            if (!token) {
                console.error("Không có token hợp lệ, không thể kết nối WebSocket.");
                ws.close();
                return;
            }
            console.log("[WebSocketProvider] Gửi CONNECT với token:", token);

            ws.send(
                JSON.stringify({
                    type: "CONNECT",
                    token: token,
                    content: "connect",
                })
            );
        };

        ws.onmessage = (event) => {
            console.log("[WebSocketProvider] (onmessage) raw data:", event.data);
            let newMessage;
            try {
                newMessage = JSON.parse(event.data);
            } catch (err) {
                console.error("[WebSocketProvider] Lỗi JSON.parse:", err);
                return;
            }

            console.log("[WebSocketProvider] (onmessage) parsed object:", newMessage);

            switch (newMessage.type) {
                case "MESSAGE":
                    console.log("[WebSocketProvider] (MESSAGE) => Cập nhật state messages và allChats.");
                    const { from, to, content } = newMessage;
                    console.log(`[WebSocketProvider] Tin nhắn nhận được từ ${from} đến ${to}: "${content}"`);

                    setMessages((prev) => {
                        const updatedMessages = [...prev, newMessage];
                        console.log("[WebSocketProvider] messages cập nhật:", updatedMessages);
                        return updatedMessages;
                    });

                    if (to === "admin") {
                        setAllChats((prevAllChats) => {
                            const userHistory = prevAllChats[from] || [];  // Lấy lịch sử cũ nếu có
                            const updatedUserHistory = [...userHistory, { sender: "user", content: content }];  // Thêm tin nhắn mới từ user
                            const updatedAllChats = {
                                ...prevAllChats,
                                [from]: updatedUserHistory,  // Cập nhật lịch sử chat cho user này
                            };
                            console.log(`[WebSocketProvider] allChats cập nhật cho ${from}:`, updatedAllChats[from]);
                            saveChatToLocal(updatedUserHistory, from);
                            return updatedAllChats;
                        });
                    }

                    break;

                case "NOTIFICATION":
                    console.log("[WebSocketProvider] (NOTIFICATION) =>", newMessage.content);
                    break;
                case "ROLE":
                    console.log("[WebSocketProvider] (ROLE) => username:", newMessage.username, "role:", newMessage.role);
                    const fallbackUsername = localStorage.getItem("username") || "unknown";
                    setUsername(newMessage.username || fallbackUsername);
                    setRole(newMessage.role);
                    console.log(`[FE] Username được set là: ${newMessage.username || fallbackUsername}`);
                    console.log(`[FE] Role được set là: ${newMessage.role}`);
                    break;
                case "LOGOUT":
                    console.log("[WebSocketProvider] (LOGOUT) => đóng websocket.");
                    shouldReconnect.current = false;
                    ws.close();
                    break;
                case "LIST_USERS":
                    console.log("[WebSocketProvider] (LIST_USERS) => userList =", newMessage.users);
                    setUserList(newMessage.users || []);
                    break;
                default:
                    console.warn("[WebSocketProvider] (UNKNOWN) =>", newMessage.type);
            }
        };

        ws.onclose = (ev) => {
            console.log("[WebSocketProvider] (onclose) WebSocket đóng, code:", ev.code, "reason:", ev.reason);
            if (shouldReconnect.current) {
                console.log("[WebSocketProvider] => Thử connect lại sau 2s...");
                setTimeout(() => connectWs(), 2000);
            }
        };

        ws.onerror = (error) => {
            console.error("[WebSocketProvider] (onerror) =>", error);
            ws.close();
        };
    };

    const sendMessage = (to, content) => {
        console.log("[WebSocketProvider] >>> sendMessage(to:", to, ", content:", content, ")");
        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            const token = localStorage.getItem("access_token") || "";
            console.log("[WebSocketProvider] (sendMessage) WebSocket OPEN => Gửi MESSAGE, token:", token);
            console.log("[FE] Username được set là:", username);
            console.log("[FE] Role được set là:", role);

            const payload = {
                type: "MESSAGE",
                token,
                to,
                content,
            };
            console.log("[WebSocketProvider] (sendMessage) payload:", payload);

            websocket.current.send(JSON.stringify(payload));
            // Lưu tin nhắn gửi đi vào lịch sử
            setAllChats((prevAllChats) => {
                const userHistory = prevAllChats[to] || [];
                const updatedUserHistory = [...userHistory, { sender: "admin", content: content }];
                const updatedAllChats = {
                    ...prevAllChats,
                    [to]: updatedUserHistory,
                };

                saveChatToLocal(updatedUserHistory, to);  // Lưu vào localStorage
                return updatedAllChats;
            });
        } else {
            console.error("[WebSocketProvider] (sendMessage) WebSocket chưa kết nối => không thể gửi tin.");
        }
    };

    useEffect(() => {
        console.log("[WebSocketProvider] useEffect => Mounting...");
        connectWs();
        return () => {
            console.log("[WebSocketProvider] useEffect => Cleanup => đóng WebSocket.");
            shouldReconnect.current = false;
            websocket.current?.close();
        };
        // eslint-disable-next-line
    }, []);

    const manualSetUser = (uname, r) => {
        setUsername(uname);
        setRole(r);
    };
    useEffect(() => {
        console.log("[WebSocketProvider] Khôi phục allChats từ sessionStorage nếu có...");
        const keys = Object.keys(sessionStorage).filter(key => key.startsWith("chatHistory_"));
        let restoredChats = {};
        keys.forEach((key) => {
            const username = key.replace("chatHistory_", "");
            restoredChats[username] = JSON.parse(sessionStorage.getItem(key));
        });
        setAllChats(restoredChats);
    }, []);


    return (
        <WebSocketContext.Provider
            value={{
                websocket,
                messages,
                username,
                role,
                userList,
                chatHistories,
                setUserList,
                setChatHistories,
                sendMessage,
                connectWs,
                manualSetUser,
                allChats,             // <-- thêm ở đây
                setAllChats,          // nếu cần chỉnh sửa state từ bên ngoài
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

// Custom hook
export const useWebSocket = () => {
    return useContext(WebSocketContext);
};


