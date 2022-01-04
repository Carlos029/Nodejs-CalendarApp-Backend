const moment = require('moment')


const isDate = (value, req) => {

    const { location, path} = req;


    if(!value && value !== 0){
        return false
    }

    const fecha = moment(value);

    if(fecha.isValid()){
        return true;
    }else{
        return false
    }
     
   
}


module.exports = {
    isDate
}