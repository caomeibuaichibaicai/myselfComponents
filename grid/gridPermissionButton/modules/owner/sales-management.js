// 售楼权限按钮
export default function ( options ) {
    let list = [];
    if ( options.isNowDetail == 1 ) {
        if( options.houseStage == 10 ){
            list.push( 'gridShouLouBtn' );//售楼
        }else{
            list.push( 'gridZhuanRangBtn' );//转让
        }
    }
    if( options.isCurrentRecord == 0 ){
        if( options.houseStage != 10 ){
            list.push( 'gridLookBtn' );//查看
        }
    }else {
        if( options.houseStage != 10 ){
            list.push( 'gridEditBtn', 'gridRevokeBtn' );//修改、撤销
        }
    }
    return list;
}