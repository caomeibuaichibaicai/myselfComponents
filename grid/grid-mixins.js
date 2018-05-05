export default {
    data() {
        return {
            initGridDate:{
                init(list){
                    if(Array.isArray(list) && list.length > 0){
                        for(let item of list){
                            for(let key in item){
                                if(key.match('Time')){
                                    if(item[key]){
                                        item[key] = this.formatTime(item[key]);
                                    }
                                }
                            }
                        }
                    }
                },
                formatTime(val){
                    let date = new Date(val);
                    let $year = date.getFullYear();
                    let $month = date.getMonth()+1;
                    let $date = date.getDate();
                    if($month < 10){
                        $month = '0'+$month;
                    }
                    if($date < 10){
                        $date = '0'+$date;
                    }
                    date = `${$year}-${$month}-${$date}`
                    return date
                },
            }
        }
    },
    created() {
    },
    methods: {
    }
}