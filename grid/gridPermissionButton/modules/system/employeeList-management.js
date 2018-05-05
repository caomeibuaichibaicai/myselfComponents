// 部门与员工权限按钮
export default function ( options ) {
    let list = [];
    if (options.userState == "0") {
        list.push( 'gridEditBtn' );//修改
        list.push( 'gridRemoveBtn' );//删除
    } else if (options.userState == "1" && options.isActived == "0") {
        list.push( 'gridEditBtn' );//修改
        list.push( 'gridRemoveBtn' );//删除
        list.push( 'gridEnableBtn' );//启用
    } else if (options.userState == "1" && options.isActived == "1") {
        list.push( 'gridEditBtn' );//修改
        list.push( 'gridRemoveBtn' );//删除
        list.push( 'gridStopBtn' );//停用
    }
    return list;
}