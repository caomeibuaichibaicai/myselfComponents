// 装修权限按钮
export default function ( options ) {
    let list = [];
    if ( options.isNowDetail == 1 ) {
        if( options.decorateStage == 0 ){
            list.push( 'gridZhuangXiuBtn' );//装修
        }
    }

    if( options.isCurrentRecord == 0 ){
        if( options.houseStage != 0 ){
            list.push( 'gridLookBtn' );//查看
        }
    }else {
        if (options.decorateStage != 0) {
            list.push( 'gridEditBtn', 'gridRevokeBtn' );//修改、撤销
        }
    }
    return list;
}