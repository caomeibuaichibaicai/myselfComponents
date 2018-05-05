//业户
import customerManagement from './owner/customer-management';
import salesManagement from './owner/sales-management';
import houseManagement from './owner/house-management';
import decorationManagement from './owner/decoration-management';
import liveManagement from './owner/live-management';
import leaseManagement from './owner/lease-management';
import receiveHouseManagement from './owner/receiveHouse-management';
//系统
import dataDictionary from './system/data-dictionary';
import rolesAndAuthorities from './system/roles-and-authorities';
import employeeListManagement from './system/employeeList-management';

import entityManagement from './masterdata/entity';


export default {
    'from-sales-management': salesManagement,
    'from-house-management': houseManagement,
    'from-decoration-management': decorationManagement,
    'from-live-management': liveManagement,
    'from-lease-management': leaseManagement,
    'from-receivehouse-management': receiveHouseManagement,
    'from-data-dictionary': dataDictionary,
    'from-roles-and-authorities': rolesAndAuthorities,
    'from-employeeList-management': employeeListManagement,
    'from-entityList-management': entityManagement,    
}