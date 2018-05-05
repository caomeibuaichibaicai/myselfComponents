// 收房权限按钮
export default function ( options ) {
    let list = [];
    if ( options.isNowDetail == 1 ) {
        if (options.houseStage * 1 <= 20) {
            list.push( 'gridShouFangBtn' );//收房
        } 
    }

    if( options.isCurrentRecord == 0 ){
        if( options.houseStage != 10 && options.houseStage != 20 ){
            list.push( 'gridLookBtn' );//查看
        }
    }else {
        if( options.houseStage != 10 ){
            list.push( 'gridEditBtn', 'gridRevokeBtn' );//修改、撤销
        }
    }
    return list;
}