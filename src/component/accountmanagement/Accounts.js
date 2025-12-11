//
// import React, { useEffect, useState } from 'react';
// import { getAllAccounts } from '../service/ApiAccounts';
// import { Table, Space } from 'antd';
// function Accounts() {
//     const [accounts, setAccounts] = useState([]);
//     useEffect(() => {
//
//         getAllAccounts()
//             .then((data) => {
//                 console.log('Dữ liệu accouns:', data);
//                 setAccounts(data);
//             })
//             .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
//     }, []);
//
//
//     const columns = [
//         {
//             title: 'Username',
//             dataIndex: 'username',
//             key: 'username',
//         },
//         {
//             title: 'Password',
//             dataIndex: 'password',
//             key: 'password',
//         },
//         {
//             title: 'Fullname',
//             dataIndex: 'fullname',
//             key: 'fullname',
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//         },
//         {
//             title: 'Photo',
//             dataIndex: 'photo',
//             key: 'photo',
//             render: (photo) => <img src={photo} alt="profile" width="50" />,
//         },
//         {
//             title: 'Token',
//             dataIndex: 'token',
//             key: 'token',
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <a>Delete</a>
//                 </Space>
//             ),
//         },
//     ];
//
//     return (
//         <div className="accounts-container">
//             <h2>Quản lý Tài Khoản</h2>
//
//             <Table columns={columns} dataSource={accounts} rowKey="username" />
//         </div>
//     );
// }
//
// export default Accounts;
