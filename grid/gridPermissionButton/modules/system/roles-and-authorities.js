// 角色与权限权限按钮
export default function ( options ) {
    let list = [];
    if (options.rolename == "超级管理员") {
        list.push( 'gridAuthorizerBtn' );//新增授权人
    } else {
        list.push( 'gridAuthorizerBtn' );//新增授权人
        list.push( 'gridEditBtn' );//修改
        list.push( 'gridRemoveBtn' );//删除
    }
    return list;
}