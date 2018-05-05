// 出租权限按钮
export default function ( options ) {
    let list = [];
    if ( options.isNowDetail == 1 ) {
        if (options.rentStage == 0 && options.houseStage != 20) {
            list.push( 'gridChuZuBtn' );//出租
        } else if (options.rentStage == 1 && options.houseStage != 20) {
            list.push( 'gridZhuanZuBtn' );//转租
            list.push( 'gridTuiZuBtn' );//退租
        }
    }

    if( options.isCurrentRecord == 0 ){
        if( options.houseStage != 0 ){
            list.push( 'gridLookBtn' );//查看
        }
    }else {
        if( options.rentStage != 0 ){
            if( options.houseOperateType == 5 || options.houseOperateType == 6 || options.houseOperateType == 7 ){
                list.push( 'gridEditBtn' );//修改
            }
            list.push( 'gridRevokeBtn' );//撤销
        }
    }
    return list;
}