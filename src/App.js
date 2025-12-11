

const getUserRole = () => {
    return localStorage.getItem("role");
};

const isAdmin = () => {
    return getUserRole() === "admin";
};

const isEmployee = () => {
    return getUserRole() === "employee";
};

const isUser = () => {
    return getUserRole() === "user";
};
export {getUserRole,isAdmin,isEmployee,isUser}