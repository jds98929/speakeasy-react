// const currUser = (() => {
//     let handle: string = '';
//     let role: string = '';

//     const set: any = (userRole: string, username: string) => {
//         if (!handle) {
//             handle = username;
//             role = userRole;
//         }
//     }
//     return {
//         getRole: () => {
//             return role;
//         },
//         getUser: () => {
//             return handle;
//         },
//         setUser: (userRole: string, username: string) => {
//             if (!handle) {
//                 set(userRole, username);
//             }
//         }
//     }
// })();

// export default currUser;