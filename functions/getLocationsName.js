export function getLocationsName(...locationNumber) {
    const locationNameList = []
    const locations = {0:"Russia",1:"India",2:"Korea",3:"Brazil",4:"Vietnam",5:"UK",6:"USA",7:"Poland"}
    locationNumber.forEach(e=>{
        if(e>Object.keys(locations).length -1){
            console.log("location not found")
        }else{
            locationNameList.push(locations[e])
        }
    })
    return locationNameList;
}