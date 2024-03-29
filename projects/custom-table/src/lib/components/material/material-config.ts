import { MatButton } from "@angular/material/button";
import { ThemePalette } from "@angular/material/core";


export interface MaterialButton {
    text: string;
    leftIcon?: string;
    leftMatIcon?: string;
    rightIcon?: string;
    rightMatIcon?: string;
    color?: ThemePalette;
    disableRipple?: boolean;
    disabled?: boolean;
}