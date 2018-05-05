import * as store from "@/utils/nsQuery/nsStore";
import ConfigObj from "./modules/gridBtnConfig";

//处理列表权限按钮
function handelGridButtons(gridName, gridData) {
    //所有权限按钮
    let permissionButtons = store.roleButtonList.get();
    //所有列表权限按钮
    let gridPermissionButtonsList = permissionButtons.filter(
        (value, index) => {
            if (value.areaType == "GRID") {
                return value;
            }
        }
    );
    //格式化列表权限按钮对象
    let gridPermissionButtons = {};
    gridPermissionButtonsList.forEach((value, index) => {
        gridPermissionButtons[value.code] = {
            label: value.name,
            value: value.code
        };
    });
    for (let i = 0, valt; valt = gridData.data[i]; i++) {
        let fncarr = getFnsclick(gridPermissionButtons, valt, gridName);
        valt.fnsclick = fncarr;
    }
}

//添加按钮
function pushGridButtons(list, gridLookBtn) {
    if (gridLookBtn === "default") {
        list.push({
            label: null,
            value: null
        });
    } else if (gridLookBtn) {
        list.push(gridLookBtn);
    }
}

function getFnsclick(gridPermissionButtons, options, gridName) {
    let gridlist = [];
    if (ConfigObj[gridName]) {
        const gridCodeList = ConfigObj[gridName](options);
        if (gridCodeList.length > 0) {
            for (let i = 0, val; val = gridCodeList[i]; i++) {
                pushGridButtons(gridlist, gridPermissionButtons[val]);
            }
        } else {
            pushGridButtons(gridlist, 'default');
        }
    } else {
        if (gridPermissionButtons != {}) {
            for (let key in gridPermissionButtons) {
                pushGridButtons(gridlist, gridPermissionButtons[key]);
            }
        } else {
            pushGridButtons(gridlist, 'default');
        }
    }
    return gridlist;
}

export default handelGridButtons;