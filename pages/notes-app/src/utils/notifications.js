import Swal from 'sweetalert2';

export const showError = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        timer: 3000,
    });
};

export const showSuccess = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 2000,
    });
};
