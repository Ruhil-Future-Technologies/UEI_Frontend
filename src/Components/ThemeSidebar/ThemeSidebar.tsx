import React from 'react';
import ContactlessOutlinedIcon from "@mui/icons-material/ContactlessOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ContrastOutlinedIcon from "@mui/icons-material/ContrastOutlined";
import BorderStyleOutlinedIcon from "@mui/icons-material/BorderStyleOutlined";
export interface ThemeSidebarProps {
    themeMode: string;
    setThemeMode: React.Dispatch<React.SetStateAction<string>>;
}
const ThemeSidebar: React.FC<ThemeSidebarProps> = ({ themeMode, setThemeMode }) => {

    const onThemeChange = (e: any) => {
        setThemeMode(e.target.value);
        document?.documentElement?.setAttribute("data-bs-theme", e.target.value);
    };

    return (
        <div
            className="offcanvas offcanvas-end"
            data-bs-scroll="true"
            tabIndex={-1}
            id="staticBackdrop"
        >
            <div className="offcanvas-header border-bottom h-70">
                <div className="">
                    <h5 className="mb-0">Theme Customizer</h5>
                    <p className="mb-0">Customize your theme</p>
                </div>
                <a
                    href="#"
                    className="primaery-menu-close"
                    data-bs-dismiss="offcanvas"
                >
                    <CloseOutlinedIcon />
                </a>
            </div>
            <div className="offcanvas-body">
                <div>
                    <p>Theme variation</p>

                    <div className="row g-3">
                        <div className="col-12 col-xl-6">
                            <input
                                type="radio"
                                value={"blue-theme"}
                                className="btn-check"
                                name="theme-options"
                                id="BlueTheme"
                                checked={themeMode === "blue-theme"}
                                onChange={(e) => onThemeChange(e)}
                            />
                            <label
                                className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                htmlFor="BlueTheme"
                            >
                                <span>
                                    <ContactlessOutlinedIcon />
                                </span>
                                <span>Blue</span>
                            </label>
                        </div>
                        <div className="col-12 col-xl-6">
                            <input
                                type="radio"
                                value={"light"}
                                className="btn-check"
                                name="theme-options"
                                id="LightTheme"
                                checked={themeMode === "light"}
                                onChange={(e) => onThemeChange(e)}
                            />
                            <label
                                className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                htmlFor="LightTheme"
                            >
                                <span>
                                    <LightModeOutlinedIcon />
                                </span>
                                <span>Light</span>
                            </label>
                        </div>
                        <div className="col-12 col-xl-6">
                            <input
                                type="radio"
                                value={"dark"}
                                className="btn-check"
                                name="theme-options"
                                id="DarkTheme"
                                checked={themeMode === "dark"}
                                onChange={(e) => onThemeChange(e)}
                            />
                            <label
                                className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                htmlFor="DarkTheme"
                            >
                                <span>
                                    <DarkModeOutlinedIcon />
                                </span>
                                <span>Dark</span>
                            </label>
                        </div>
                        <div className="col-12 col-xl-6">
                            <input
                                type="radio"
                                value={"semi-dark"}
                                className="btn-check"
                                name="theme-options"
                                id="SemiDarkTheme"
                                checked={themeMode === "semi-dark"}
                                onChange={(e) => onThemeChange(e)}
                            />
                            <label
                                className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                htmlFor="SemiDarkTheme"
                            >
                                <span>
                                    <ContrastOutlinedIcon />
                                </span>
                                <span>Semi Dark</span>
                            </label>
                        </div>
                        <div className="col-12 col-xl-6">
                            <input
                                type="radio"
                                value={"bordered-theme"}
                                className="btn-check"
                                name="theme-options"
                                id="BoderedTheme"
                                checked={themeMode === "bordered-theme"}
                                onChange={(e) => onThemeChange(e)}
                            />
                            <label
                                className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                                htmlFor="BoderedTheme"
                            >
                                <span>
                                    <BorderStyleOutlinedIcon />
                                </span>
                                <span>Bordered</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemeSidebar;