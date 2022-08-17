export default interface Toast {
    id: Number,
    type: string,
    dismissible: boolean,
    timeout: Number,
    message: string,
}