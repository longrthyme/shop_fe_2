import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {MessageOutlined, ShoppingOutlined} from '@ant-design/icons';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from '../../../AuthContext';
import {useWebSocket} from "../../../WebSocketProvider";
import {Input, Modal} from "antd";

function Header() {
    const role = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');

    const navigate = useNavigate();
    const {isAuthenticated, logout} = useAuth();

    const {
        messages,
        username,
        userList,
        sendMessage,
        setUserList,
        manualSetUser,
        setAllChats,
        allChats,         // Lấy từ context
    } = useWebSocket();

    const [unreadCounts, setUnreadCounts] = useState({});

    const [localUserName] = useState(storedUsername || null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [to, setTo] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [chatMessage, setChatMessage] = useState("");


    const [newMessageCount, setNewMessageCount] = useState(0);

    const [cartQuantity, setCartQuantity] = useState(0);
    const saveChatToLocal = (history, userKey) => {
        localStorage.setItem("chatHistory_" + userKey, JSON.stringify(history));
    };

    const loadChatFromLocal = (userKey) => {
        const stored = localStorage.getItem("chatHistory_" + userKey);
        return stored ? JSON.parse(stored) : [];
    };


    useEffect(() => {
        console.log("Username từ context thay đổi:", username);
    }, [username]);

    useEffect(() => {
        if (!username && storedUsername) {
            manualSetUser(storedUsername, role);
            console.log("[Header] => manualSetUser(", storedUsername, role, ")");
        } else {
            console.log("[Header] => already have username:", username, "role:", role);
        }
    }, [username, role, storedUsername, manualSetUser]);

    useEffect(() => {
        const qty = Number(localStorage.getItem("cartQuantity")) || 0;
        setCartQuantity(qty);
    }, []);

    useEffect(() => {
        const updateQty = () => {
            const qty = Number(localStorage.getItem("cartQuantity")) || 0;
            setCartQuantity(qty);
        };
        updateQty();
        window.addEventListener("storage", updateQty);
        return () => {
            window.removeEventListener("storage", updateQty);
        };
    }, []);

    useEffect(() => {
        const updateCartQuantity = () => {
            const qty = localStorage.getItem("cartQuantity") || 0;
            setCartQuantity(Number(qty));
        };
        window.addEventListener("cartQuantityChange", updateCartQuantity);
        updateCartQuantity();
        return () => {
            window.removeEventListener("cartQuantityChange", updateCartQuantity);
        };
    }, []);

    const openChat = () => {
        setNewMessageCount(0);

        if (role === "USER") {
            setTo("admin");
            // Khôi phục lịch sử chat từ sessionStorage khi user mở lại
            const history = loadChatFromLocal("admin");
            console.log(`[Header] Khôi phục lịch sử từ localStorage cho user:`, history);
            setChatHistory(history);  // Gán lịch sử từ sessionStorage
        }

        if (role === "ADMIN") {
            setTo("");
            setChatHistory([]);
        }

        setIsChatOpen(true);
    };


    const handleSendMessage = () => {
        if (!chatMessage.trim() || !to) return;

        const senderRole = (role === "ADMIN") ? "admin" : "user";
        const newMessage = {sender: senderRole, content: chatMessage};

        const currentUsername = username || localUserName;
        console.log("[FE] Đang gửi tin từ:", currentUsername);

        sendMessage(to, chatMessage);

        setChatHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newMessage];
            saveChatToLocal(updatedHistory, to);
            return updatedHistory;
        });
        setChatMessage("");
    };
    const handleSelectUser = (user) => {
        setTo(user);
        setChatHistory([]);
        setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [user]: 0
        }));

        const sessionHistory = loadChatFromLocal(user);
        if (sessionHistory.length > 0) {
            console.log(`[Header] Lấy lịch sử từ session cho ${user}:`, sessionHistory);
            setChatHistory(sessionHistory);
        } else {
            const historyFromAllChats = allChats[user] || [];
            console.log(`[Header] Lấy lịch sử từ allChats cho ${user}:`, historyFromAllChats);
            setChatHistory(historyFromAllChats);
        }
    };

    useEffect(() => {
        if (messages.length === 0) return;

        const latest = messages[messages.length - 1];
        console.log("[Header] Latest message =>", latest);
        console.log("[Header] Current role:", role);

        const userNameToCompare = username || storedUsername;

        if (role === "USER") {
            if (latest.from === "admin" && latest.to === userNameToCompare) {
                const newMsg = {sender: "admin", content: latest.content};
                const updated = [...chatHistory, newMsg];
                setChatHistory(updated);
                saveChatToLocal(updated, "admin");
            }
        }

        if (role === "ADMIN") {
            console.log("[Header] Admin detected, processing new messages...");
            // Khi nhận tin nhắn từ user gửi tới admin
            if (latest.to === "admin") {
                const user = latest.from;
                console.log(`[Header] Tin nhắn từ user ${user} đến admin nhận được.`);

                // Cập nhật allChats với tin nhắn mới
                setAllChats(prevAllChats => {
                    const userHistory = prevAllChats[user] || [];
                    return {
                        ...prevAllChats,
                        [user]: [...userHistory, {sender: "user", content: latest.content}]
                    };
                });

                // Cập nhật số lượng tin nhắn chưa đọc cho user gửi tin
                setUnreadCounts(prevCounts => ({
                    ...prevCounts,
                    [user]: (prevCounts[user] || 0) + 1
                }));

                // Tăng số lượng tin nhắn mới tổng cộng
                setNewMessageCount(prev => prev + 1);

                // Cập nhật thứ tự userList: đưa user gửi tin nhắn lên đầu danh sách
                setUserList(prevUserList => {
                    const updatedList = prevUserList.filter(u => u !== user);
                    return [user, ...updatedList];
                });

                // Nếu admin đang chat với user này, cập nhật chatHistory ngay lập tức
                if (user === to) {
                    console.log(`[Header] Admin đang chat với ${user}, cập nhật chatHistory.`);
                    setChatHistory(prevHistory => {
                        const newMsg = {sender: "user", content: latest.content};
                        const updatedHistory = [...prevHistory, newMsg];
                        saveChatToLocal(updatedHistory, to);
                        return updatedHistory;
                    });
                    setUnreadCounts(prevCounts => ({
                        ...prevCounts,
                        [to]: 0
                    }));
                }
            }

            // Nếu admin đang chat với một user cụ thể (bên ngoài khối trên)
            if (latest.from === to && latest.to === "admin") {
                // Xử lý riêng nếu cần (nhưng chúng ta đã xử lý ở trên nếu user === to)
                // Có thể bỏ qua phần này nếu logic đã được xử lý ở trên
            }
        }
    }, [messages]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="header container-fluid g-0">
            <Modal
                title={
                    role === "ADMIN"
                        ? (to ? `Đang chat với ${to}` : "Chọn user để chat")
                        : "Đang chat với admin"
                }
                visible={isChatOpen}
                onCancel={() => setIsChatOpen(false)}
                footer={null}
            >
                {role === "ADMIN" && !to && (
                    <div style={{marginBottom: 10}}>
                        <p><strong>Danh sách user đang online:</strong></p>
                        {userList.length === 0 ? (
                            <p>Hiện không có user nào.</p>
                        ) : (
                            <ul style={{border: "1px solid #ccc", padding: 10}}>
                                {userList.map((u) => (
                                    <li key={u} style={{marginBottom: 4}}>
                                        <button onClick={() => handleSelectUser(u)}>
                                            Chat với {u}
                                            {unreadCounts[u] > 0 && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    background: 'red',
                                                    borderRadius: '50%',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    fontSize: '12px'
                                                }}>
                                                    {unreadCounts[u]}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {to && (
                    <>
                        <div ref={chatContainerRef}Timeline
                             style={{maxHeight: "300px", overflowY: "auto", marginBottom: "10px"}}>
                            {chatHistory.map((msg, index) => (

                                <div
                                    key={role === 'user' ? `user${index}`: `admin${index}`}
                                    style={{
                                        textAlign:
                                            role === "user"
                                                ? msg.sender === "user"
                                                    ? "right"
                                                    : "left"
                                                : msg.sender === "user"
                                                    ? "left"
                                                    : "right",
                                        margin: "5px 0",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "inline-block",
                                            padding: "10px",
                                            borderRadius: "10px",
                                            backgroundColor: msg.sender === "user" ? "#daf1e0" : "#f1f1f1",
                                        }}
                                    >
                                        {msg.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Input
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onPressEnter={handleSendMessage}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{
                                marginTop: "10px",
                                padding: "5px 10px",
                                backgroundColor: "#1890ff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Gửi
                        </button>
                    </>
                )}
            </Modal>

            <div className="container-fluid g-0 header" id="navbar" style={{width: '100%'}}>
                <div
                    className="container d-flex align-items-center justify-content-between"
                    style={{height: '84px'}}
                >
                    <div className="header_left d-flex align-items-center">
                        {/*<div className="logo" style={{marginRight: '10px'}}>*/}
                        {/*    <Link className="nav-link" to="/wed/trangchu">*/}
                        {/*        <img*/}
                        {/*            src="/Images/image/logo.png"*/}
                        {/*            alt="logo"*/}
                        {/*            style={{*/}
                        {/*                width: '40px',*/}
                        {/*                height: '40px',*/}
                        {/*                borderRadius: '50%',*/}
                        {/*                backgroundColor: 'black'*/}
                        {/*            }}*/}
                        {/*        />*/}
                        {/*    </Link>*/}
                        {/*</div>*/}
                        <div
                            className="logo_name"
                            style={{fontSize: '24px', fontWeight: 'bold', color: '#000'}}
                        >
                            OWEN
                        </div>
                        <nav className="navbar navbar-expand-lg navbar-light ms-4">
                            <div className="container-fluid">
                                <ul className="navbar-nav">

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/wed/trangchu">Trang chủ</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/wed/collections">Danh sách sản phẩm</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    <div style={{display: "flex"}}>
                        <div
                            className="header_right d-flex align-items-center"
                            style={{ marginRight: '10px' }}
                        >
                            <button
                                onClick={() => navigate('/user/cart')}
                                className="position-relative btn"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <ShoppingOutlined />

                                {cartQuantity > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '10px' }}
                                    >
                                       {cartQuantity}
                                   </span>
                                )}

                            </button>
                        </div>


                        {isAuthenticated ? (
                            <>
                                <div className="icon me-4 position-relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="btn"
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            style={{fontSize: '18px', color: '#5C5F6A'}}
                                        />
                                    </button>
                                    {showUserMenu && (
                                        <div
                                            className="position-absolute bg-white border rounded"
                                            style={{top: '30px', left: 0, minWidth: '120px', zIndex: 999}}
                                        >
                                            <ul className="list-unstyled m-0 p-2">
                                                <li>
                                                    <Link to="/user/account" className="dropdown-item">
                                                        Tài khoản
                                                    </Link>
                                                </li>
                                                {/*<li>*/}
                                                {/*    <Link to="/user/order-details" className="dropdown-item">*/}
                                                {/*        Lịch sử đặt hàng*/}
                                                {/*    </Link>*/}
                                                {/*</li>*/}
                                                <li>
                                                    <button onClick={logout} className="dropdown-item">
                                                        Đăng xuất
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <button
                                        onClick={openChat}
                                        className="btn"
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            position: 'relative'
                                        }}
                                    >
                                        <MessageOutlined style={{fontSize: "24px", color: "#5C5F6A"}}/>
                                        {/* Hiển thị badge nếu có tin nhắn mới */}
                                        {role === "ADMIN" && newMessageCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-5px',
                                                background: 'red',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px'
                                            }}>
                                                {newMessageCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span
                                    onClick={() => navigate('/login')}
                                    style={{
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                        cursor: 'pointer',
                                        color: '#1890ff'
                                    }}
                                >
                                    Đăng nhập /
                                </span>
                                <span
                                    onClick={() => navigate('/register')}
                                    style={{
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                        cursor: 'pointer',
                                        color: '#1890ff'
                                    }}
                                >
                                    Đăng ký
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
