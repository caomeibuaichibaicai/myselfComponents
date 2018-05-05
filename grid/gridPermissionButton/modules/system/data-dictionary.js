// 数据字典权限按钮
export default function ( options ) {
    let list = [];
    if (options.enterpriseId != 0) {
        list.push( 'gridEditBtn', 'gridRemoveBtn' );//修改、删除
    }
    return list;
}