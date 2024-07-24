import axios from "axios";

const API_KEY = "45023501-5f38047f7a11bf70d40687230";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formateURL = (params) => {
    let url = apiUrl+"&per_page=25&safesearch=true&editors_choice=true";
    if(!params){
        return url;
    }
    let paramKeys = Object.keys(params);
    paramKeys.map(key=> {
        let value = key=='q'?encodeURIComponent(params[key]):params[key];
        url += `&${key}=${value}`;
    })
    // console.log(url);
    return url;
}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formateURL(params));
        const {data} = response;
        return {
            success: true,
            data: data,
        }
    }
    catch (error) {
        console.log('got error: ', error.message);
        return {
            success: false,
            msg: error.message,
        }
    }
}