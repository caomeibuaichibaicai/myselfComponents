export default function ( options ) {
    let list = [];
    if (options.id != 0) {
        list.push( 'gridEditBtn', 'gridRemoveBtn' ,'editDataCode','bindDataTable');//修改、删除
    }
    return list;
}