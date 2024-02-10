import Swal from "sweetalert2";

export function sweetAlertSuccess(title: string, text: string, footerUrl?: string) {
    if(footerUrl === "") {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            footer: `<a class="link-dark" href=${footerUrl}>Go to Login page</a>`
        });
    } else {
        Swal.fire({
            title: title,
            text: text,
            icon: "success"
        });
    }
}

export function sweetAlertError(title: string, text: string) {
    Swal.fire({
        title: title,
        text: text,
        icon: "error",
    });
}

// TODO KOLLA OM ALERT KAN FÖRSVINNA EFTER X ANTAL SEKUNDER MER SOM EN SNABB POPUP MED INFO
