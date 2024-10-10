export const isNullOrUndefined = (value: unknown) =>
    value === undefined || value === null;


export const getDateFormat = (value: any) => {
    // if (value == null) {
    //   return "DD-MM-YYYY";
    // }
  
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
    return date?.toLocaleDateString("en-GB", options); // Format date as "12 May 1998"
  };
  

  // for compare values 
  export function deepEqual(a:any, b:any) {
    if (a === b) return true;
      if (a === null || b === null) { return false }
    if (typeof a !== 'object' || typeof b !== 'object') return false;
  
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
  
    if (keysA.length !== keysB.length) return false;
  
    for (let key of keysA) {
      if (!keysB.includes(key)
   || !deepEqual(a[key], b[key])) {
        return false;
      }
    }
  
    return true;
  }

  export const hasSubMenu = (menuListdata:any, menuName:any) => {
    // console.log("Type of menuListdata:", typeof menuListdata);
    if (!Array.isArray(menuListdata)) {
        console.error("menuListdata is not an array:", menuListdata);
        return false;
    }

    return menuListdata.some(menu => {
        if (!Array.isArray(menu?.submenus)) {
            console.error("submenus is not an array for menu:", menu);
            return false;
        }

        // const hasSubMenu = menu.submenus.some((submenu:any) => submenu.menu_name === menuName);
        const hasSubMenu = menu?.submenus.some((submenu: any) => {
          // Check if either menu_name or menu.menu_name matches
          
          // return submenu?.menu_name?.toLowerCase() === menuName?.toLowerCase();
         
          const normalizedSubmenuName = submenu?.menu_name?.replace(/\s+/g, '').toLowerCase();
          const normalizedMenuName = menuName?.replace(/\s+/g, '').toLowerCase();
          return normalizedSubmenuName === normalizedMenuName;

      });
        // console.log(`Checking menu: ${menu.menu_name.toLowerCase()}, hasSubMenu: ${hasSubMenu} `);
        return hasSubMenu;
    });
};


export const dataaccess = (Menulist: any,lastSegment: any,urlcheck:any,datatest:any)=>{
  let filteredData = null;
    // console.log("tttt===",urlcheck?.urlcheck,datatest)
  JSON.parse(Menulist)?.forEach((data: any) => {
      if (data?.menu_name.toLowerCase() === lastSegment) {
          filteredData = data; // Found a match in the main menu
      } else {
          const result = data?.submenus?.find((menu: any) => menu?.menu_name.toLowerCase() === urlcheck?.urlcheck ? datatest?.datatest : menu?.menu_name.toLowerCase() === lastSegment);
          if (result) {
              // Found a match in the submenu
              filteredData = {
                  ...data,
                  submenus: [result] // Include only the matched submenu
              };
          }
      }
  });

  if (filteredData) {
      // setFilteredData(filteredData);
      return filteredData
      
  } else {
      
      // setFilteredData(null);
      return null
     
  }
}

export const tabletools =(themes: any)=>{
  const tabletools:any = {
    light:'#547476',dark:'#00D1D9',default:'#547476'
  }
  return tabletools[themes]
}

export const inputfield =(themes: any)=>{
  const tabletools:any = {
    light:'#FFFFFF',dark:'#151E26',default:'#FFFFFF'
  }
  return tabletools[themes]
}
export const inputfieldselect =(themes: any)=>{
  const tabletools:any = {
    light:'#F4F7F7',dark:'#1d2a35',default:'#F4F7F7'
  }
  return tabletools[themes]
}
export const inputfieldtext =(textcolor: any)=>{
  const inputtext:any = {
    light:'#1C1C1C',dark:'#FFFFFF',default:'#1C1C1C'
  }
  return inputtext[textcolor]
}
export const inputfieldtextselect =(textcolor: any)=>{
  const inputtext:any = {
    light:'#1C1C1C',dark:'#FFFFFF',default:'#1C1C1C'
  }
  return inputtext[textcolor]
}
export const inputfieldhover =(textcolor: any)=>{
  const inputtext:any = {
    light:'#edf4fb',dark:'#152533',default:'#edf4fb'
  }
  return inputtext[textcolor]
}

export const chatdialog =(themes: any)=>{
  const tabletools:any = {
    light:'#F4F7F7',dark:'#151E26',default:'#F4F7F7'
  }
  return tabletools[themes]
}
export const chattextbgright =(themes: any)=>{
  const tabletools:any = {
    light:'#003032',dark:'#2f2f2f',default:'#003032'
  }
  return tabletools[themes]
}
export const chattextbgleft =(themes: any)=>{
  const tabletools:any = {
    light:'#f1f1f1',dark:'#f1f1f1',default:'#f1f1f1'
  }
  return tabletools[themes]
}
export const chattextright =(themes: any)=>{
  const tabletools:any = {
    light:'#FFFFFF',dark:'#FFFFFF',default:'#FFFFFF'
  }
  return tabletools[themes]
}
export const chattextleft =(themes: any)=>{
  const tabletools:any = {
    light:'#000',dark:'#000',default:'#000'
  }
  return tabletools[themes]
}
export const chatdatetext =(themes: any)=>{
  const tabletools:any = {
    light:'#1C1C1C',dark:'#F4F7F7',default:'#1C1C1C'
  }
  return tabletools[themes]
}
export const chatcalandericon =(themes: any)=>{
  const tabletools:any = {
    light:'#024F52',dark:'#2f2f2f',default:'#024F52'
  }
  return tabletools[themes]
}
    