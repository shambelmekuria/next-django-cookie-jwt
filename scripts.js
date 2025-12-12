const admin_paths_regex = /^\/admin/;
const user_paths_regex = /^\/home|^\/$/;
const test_paths = '/admin/setting';

console.log(admin_paths_regex.test(test_paths));