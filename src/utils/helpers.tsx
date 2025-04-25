/* eslint-disable @typescript-eslint/no-explicit-any */
export const isNullOrUndefined = (value: unknown) =>
  value === undefined || value === null;

export const getDateFormat = (value: any) => {
  const date = new Date(value);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date?.toLocaleDateString('en-GB', options); // Format date as "12 May 1998"
};

// for compare values
export function deepEqual(a: any, b: any) {
  if (a === b) return true;
  if (a === null || b === null) {
    return false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export const hasSubMenu = (menuListdata: any, menuName: any) => {
  if (!Array.isArray(menuListdata)) {
    console.error('menuListdata is not an array:', menuListdata);
    return false;
  }

  return menuListdata.some((menu) => {
    if (!Array.isArray(menu?.submenus)) {
      console.error('submenus is not an array for menu:', menu);
      return false;
    }

    // const hasSubMenu = menu.submenus.some((submenu:any) => submenu.menu_name === menuName);
    const hasSubMenu = menu?.submenus.some((submenu: any) => {
      // Check if either menu_name or menu.menu_name matches

      // return submenu?.menu_name?.toLowerCase() === menuName?.toLowerCase();

      const normalizedSubmenuName = submenu?.menu_name
        ?.replace(/\s+/g, '')
        .toLowerCase();
      const normalizedMenuName = menuName?.replace(/\s+/g, '').toLowerCase();
      console.log(normalizedSubmenuName);
      return normalizedMenuName;
    });
    // console.log(`Checking menu: ${menu.menu_name.toLowerCase()}, hasSubMenu: ${hasSubMenu} `);
    return hasSubMenu;
  });
};

export const dataaccess = (
  Menulist: any,
  lastSegment: any,
  urlcheck: any,
  datatest: any,
) => {
  let filteredData = null;
  JSON.parse(Menulist)?.forEach((data: any) => {
    if (data?.menu_name.toLowerCase() === lastSegment) {
      filteredData = data; // Found a match in the main menu
    } else {
      const result = data?.submenus?.find((menu: any) => {
        if (menu?.menu_name.toLowerCase() === urlcheck?.urlcheck) {
          return datatest?.datatest;
        }
        // Extract the last segment of submenu_url for comparison
        const lastSegmentFromURL = menu?.submenu_url?.substring(menu?.submenu_url?.lastIndexOf("/") + 1);  
        return lastSegmentFromURL?.toLowerCase() === lastSegment?.toLowerCase();
      });
      if (result) {
        filteredData = {
          ...data,
          submenus: [result],
        };
      }
    }
  });

  if (filteredData) {
    return filteredData;
  } else {
    return null;
  }
};

export const datadashboard = (
  Menulist: any,
  lastSegment: any,
) => {
  let filteredData = null;
  JSON.parse(Menulist)?.forEach((data: any) => {
    if (data?.menu_name.toLowerCase() === lastSegment) {
      filteredData = data; // Found a match in the main menu
    } else {
      const result = data?.submenus?.find((menu: any) => {
       
        // Extract the last segment of submenu_url for comparison
        const lastSegmentFromURL = menu?.submenu_url?.substring(menu?.submenu_url?.lastIndexOf("/") + 1);  
        return lastSegmentFromURL?.toLowerCase() === lastSegment?.toLowerCase();
      });
      if (result) {
        filteredData = {
          ...data,
          submenus: [result],
        };
      }
    }
  });

  if (filteredData) {
    return true;
  } else {
    return false;
  }
};

export const tabletools = (themes: any) => {
  const tabletools: any = {
    light: '#547476',
    dark: '#00D1D9',
    default: '#547476',
  };
  return tabletools[themes];
};

export const inputfield = (themes: any) => {
  const tabletools: any = {
    light: '#FFFFFF',
    dark: '#32363b',
    default: '#FFFFFF',
  };
  return tabletools[themes];
};
export const inputfieldselect = (themes: any) => {
  const tabletools: any = {
    light: '#F4F7F7',
    dark: '#1d2a35',
    default: '#F4F7F7',
  };
  return tabletools[themes];
};
export const inputfieldtext = (textcolor: any) => {
  const inputtext: any = {
    light: '#1C1C1C',
    dark: '#dee2e6',
    default: '#1C1C1C',
  };
  return inputtext[textcolor];
};
export const inputfieldtextselect = (textcolor: any) => {
  const inputtext: any = {
    light: '#1C1C1C',
    dark: '#FFFFFF',
    default: '#1C1C1C',
  };
  return inputtext[textcolor];
};
export const inputfieldhover = (textcolor: any) => {
  const inputtext: any = {
    light: '#edf4fb',
    dark: '#99c8ff',
    default: '#edf4fb',
  };
  return inputtext[textcolor];
};

export const chatdialog = (themes: any) => {
  const tabletools: any = {
    light: '#F4F7F7',
    dark: '#151E26',
    default: '#F4F7F7',
  };
  return tabletools[themes];
};
export const chattextbgright = (themes: any) => {
  const tabletools: any = {
    light: '#003032',
    dark: '#2f2f2f',
    default: '#003032',
  };
  return tabletools[themes];
};
export const chattextbgleft = (themes: any) => {
  const tabletools: any = {
    light: '#f1f1f1',
    dark: '#f1f1f1',
    default: '#f1f1f1',
  };
  return tabletools[themes];
};
export const chattextright = (themes: any) => {
  const tabletools: any = {
    light: '#FFFFFF',
    dark: '#FFFFFF',
    default: '#FFFFFF',
  };
  return tabletools[themes];
};
export const chattextleft = (themes: any) => {
  const tabletools: any = {
    light: '#000',
    dark: '#000',
    default: '#000',
  };
  return tabletools[themes];
};
export const chatdatetext = (themes: any) => {
  const tabletools: any = {
    light: '#1C1C1C',
    dark: '#F4F7F7',
    default: '#1C1C1C',
  };
  return tabletools[themes];
};
export const chatcalandericon = (themes: any) => {
  const tabletools: any = {
    light: '#024F52',
    dark: '#2f2f2f',
    default: '#024F52',
  };
  return tabletools[themes];
};
export const commonStyle = (namecolor: any) => ({
  backgroundColor: inputfield(namecolor),
  color: inputfieldtext(namecolor),
  '&:hover': {
    backgroundColor: inputfieldhover(namecolor),
    //color: 'black !important',
  },
  '&.Mui-selected': {
   // backgroundColor: inputfield(namecolor),
   // color: 'black !important',
  },
  '&.Mui-selected, &:focus': {
   // backgroundColor: '#F7F0FE',
    //color: 'black !important',
  },
});
export const fieldIcon = (textcolor: any) => {
  const inputtext: any = {
    light: '#707070',
    dark: '#D5D5D5',
    default: '#707070',
  };
  return inputtext[textcolor];
};

export const toTitleCase=(str: string): string =>{
  return str
    .toLowerCase() // Convert everything to lowercase first
    .split(" ") // Split by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" "); // Join words back together
}

export const getColor = (value: number, max: number) => {
  const mid = max / 2; // Midpoint where it's fully orange

  if (value >= max) return "#4CAF50"; // Fully Green (Success)
  if (value <= 0) return "#FF0000";  // Fully Red (Danger)

  let red, green;

  if (value > mid) {
    // Transition from Green → Orange
    const factor = (max - value) / (max - mid);
    red = Math.floor(factor * 255);   // Increase red
    green = Math.floor(76 + factor * (165 - 76)); // Reduce green slightly
  } else {
    // Transition from Orange → Red
    const factor = value / mid;
    red = 255;  // Keep fully red
    green = Math.floor(factor * 165); // Reduce green
  }

  return `rgb(${red}, ${green}, 0)`;
};
// Utility function to convert GMT to IST
export const convertToIST = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);
  return istDate.toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};
export const convertToISTT = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString); // treated as UTC

  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', // Force IST here
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};
