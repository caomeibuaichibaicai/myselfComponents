// 房产权限按钮
export default function ( options ) {
    let list = [];
    if (options.houseStage == 10) {
        list.push( 'gridShouLouBtn' );//售楼
    } else {
        list.push( 'gridZhuanRangBtn' );//转让
    }
    if (options.houseStage == 30) {
        list.push( 'gridRuZhuBtn' );//入住
    }
    if (options.houseStage == 40) {
        list.push( 'gridBanChuBtn' );//搬出
        list.push( 'gridKongGuanBtn' );//空关
    }
    if (options.houseStage * 1 <= 20) {
        list.push( 'gridShouFangBtn' );//收房
    }
    if (options.decorateStage == 0) {
        list.push( 'gridZhuangXiuBtn' );//装修
    }
    if (options.rentStage == 0 && options.houseStage != 20) {
        // debugger
        list.push( 'gridChuZuBtn' );//出租
    } else if (options.rentStage == 1 && options.houseStage != 20) {
        list.push( 'gridZhuanZuBtn' );//转租
        list.push( 'gridTuiZuBtn' );//退租
    }
    return list;
}