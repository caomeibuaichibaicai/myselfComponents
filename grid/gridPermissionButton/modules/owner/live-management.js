// 入住权限按钮
export default function ( options ) {
    let list = [];
    if ( options.isNowDetail == 1 ) {
        if (options.houseStage == 30) {
            list.push( 'gridRuZhuBtn' );//入住
        } else if (options.houseStage == 40) {
            list.push( 'gridBanChuBtn' );//搬出
            list.push( 'gridKongGuanBtn' );//空关
        }
    }
    if( options.isCurrentRecord == 0 ){
        if( options.houseStage*1 >= 30 && options.houseOperateType*1 > 2 ){
            list.push( 'gridLookBtn' );//查看
        }
    }else {
        if( options.houseStage != 10 ){
            if( options.houseOperateType == 3 || options.houseOperateType == 4 || options.houseOperateType == 8 ){
                list.push( 'gridEditBtn' );//修改
            }
            list.push( 'gridRevokeBtn' );//撤销
        }
    }
    return list;
}